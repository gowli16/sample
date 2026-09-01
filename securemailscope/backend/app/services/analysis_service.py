"""
SecureMailScope — Analysis pipeline orchestrator.

This service wires the full pipeline:
  PCAP parse → protocol detect → session reconstruct →
  TLS analyse → cert analyse → feature extract → ML predict →
  vulnerability detect → compile result.

In-memory dict stores results keyed by analysis ID (prototype).
"""

import asyncio
import uuid
from datetime import datetime, timezone
from typing import Dict, Optional

from app.models.schemas import (
    AnalysisResult, AnalysisStatus, TrafficType,
    Finding, Severity, SessionInfo, RiskAssessment,
    TLSVersionCounts, RiskLevel
)
from app.analysis.pcap_parser import get_parser
from app.analysis.protocol_detector import ProtocolDetector
from app.analysis.session_reconstructor import SessionReconstructor
from app.analysis.tls_analyzer import TLSAnalyzer
from app.analysis.certificate_analyzer import CertificateAnalyzer
from app.analysis.feature_extractor import FeatureExtractor
from app.ml.risk_engine import RiskEngine


class AnalysisService:
    """Orchestrates the full PCAP → Security Report pipeline."""

    def __init__(self):
        self.results: Dict[str, AnalysisResult] = {}
        self.risk_engine = RiskEngine()

    # ── Public API ────────────────────────────────────────────────────────

    async def start_analysis(self, analysis_id: str, filepath: str):
        """Register a new analysis and kick off the background pipeline."""
        self.results[analysis_id] = AnalysisResult(
            id=analysis_id,
            status=AnalysisStatus.PROCESSING,
            traffic_type=TrafficType.UNKNOWN,
            protocol_counts={},
            sessions=[],
            findings=[],
            analysis_timestamp=datetime.now(timezone.utc).isoformat(),
        )
        asyncio.create_task(self._run_pipeline(analysis_id, filepath))

    def get_result(self, analysis_id: str) -> Optional[AnalysisResult]:
        return self.results.get(analysis_id)

    # ── Pipeline ──────────────────────────────────────────────────────────

    async def _run_pipeline(self, analysis_id: str, filepath: str):
        try:
            result = self.results[analysis_id]

            # ─── Step 1: Parse PCAP (Zeek 5-star Architecture for Kali Linux) ────
            parser = get_parser("zeek")
            raw_packets = parser.parse(filepath)

            # ─── Step 2: Detect protocols ─────────────────────────────
            traffic_type, protocol_counts = ProtocolDetector.detect(raw_packets)
            result.traffic_type = traffic_type
            result.protocol_counts = protocol_counts

            # ─── Step 2b: Out-of-scope handling ───────────────────────
            if traffic_type == TrafficType.NON_EMAIL:
                result.status = AnalysisStatus.NOT_APPLICABLE
                result.error_message = (
                    "No supported email communication was detected in this PCAP."
                )
                # Collect detected non-email traffic labels
                detected = set()
                for pkt in raw_packets:
                    label = pkt.get("traffic_label")
                    if label:
                        detected.add(label)
                    else:
                        detected.add(pkt.get("protocol", "Unknown"))
                result.detected_traffic_types = sorted(detected)
                result.recommendations = [
                    "Upload a PCAP containing SMTP, IMAP, or POP3 traffic.",
                    "Ensure the capture includes port 25, 465, 587, 143, 993, 110, or 995.",
                ]
                return

            # ─── Step 3: Reconstruct sessions ─────────────────────────
            sessions = SessionReconstructor.reconstruct(raw_packets)

            # ─── Steps 4-7: Analyse each session ─────────────────────
            all_findings: list[Finding] = []
            tls_counts = TLSVersionCounts()
            encrypted_count = 0
            unencrypted_count = 0
            risk_scores: list[int] = []

            for session in sessions:
                session_findings = self._analyse_session(session, tls_counts)
                all_findings.extend(session_findings)
                session.session_findings = session_findings

                # Count encryption
                if session.crypto_details and session.crypto_details.tls_version not in ("None", "", None):
                    encrypted_count += 1
                else:
                    unencrypted_count += 1

                # ─── Step 8: ML risk assessment per session ───────────
                features = FeatureExtractor.extract_features(session)
                assessment = self.risk_engine.assess_risk(features)
                session.risk_score = assessment.score
                session.risk_level = assessment.level.value

                risk_scores.append(assessment.score)

            # ─── Aggregate risk (weighted max) ────────────────────────
            if risk_scores:
                # Overall = weighted blend: 70% worst session, 30% average
                worst = max(risk_scores)
                avg = sum(risk_scores) / len(risk_scores)
                overall_score = int(worst * 0.7 + avg * 0.3)
                overall_score = min(max(overall_score, 0), 100)

                # Re-run risk engine on a synthetic "worst" feature set for explainability
                worst_session = max(sessions, key=lambda s: s.risk_score or 0)
                worst_features = FeatureExtractor.extract_features(worst_session)
                overall_assessment = self.risk_engine.assess_risk(worst_features)
                overall_assessment.score = overall_score
                # Re-derive level from aggregated score
                if overall_score >= 80:
                    overall_assessment.level = RiskLevel.CRITICAL
                elif overall_score >= 55:
                    overall_assessment.level = RiskLevel.HIGH
                elif overall_score >= 30:
                    overall_assessment.level = RiskLevel.MEDIUM
                else:
                    overall_assessment.level = RiskLevel.LOW
            else:
                overall_assessment = None

            # ─── Compile result ───────────────────────────────────────
            result.sessions = sessions
            result.findings = all_findings
            result.risk_assessment = overall_assessment
            result.tls_version_counts = tls_counts
            result.total_sessions = len(sessions)
            result.encrypted_sessions = encrypted_count
            result.unencrypted_sessions = unencrypted_count
            result.recommendations = self._generate_recommendations(all_findings)
            result.status = AnalysisStatus.COMPLETED

        except Exception as e:
            import traceback
            traceback.print_exc()
            self.results[analysis_id].status = AnalysisStatus.FAILED
            self.results[analysis_id].error_message = str(e)

    # ── Per-session analysis ──────────────────────────────────────────────

    def _analyse_session(
        self,
        session: SessionInfo,
        tls_counts: TLSVersionCounts,
    ) -> list[Finding]:
        """Run deterministic security rules on a single session."""
        findings: list[Finding] = []

        # Shorthand
        cd = session.crypto_details
        sid = session.id
        host = session.hostname or f"{session.dst_ip}:{session.dst_port}"

        # ── Plaintext authentication ──────────────────────────────────
        if session.has_plaintext_auth:
            findings.append(Finding(
                severity=Severity.CRITICAL,
                title="Plaintext Email Authentication Detected",
                description=(
                    f"Session {sid} transmitted authentication credentials "
                    f"in cleartext to {host} on port {session.dst_port}."
                ),
                evidence=(
                    f"AUTH PLAIN / LOGIN command observed on unencrypted "
                    f"connection to {host}:{session.dst_port}"
                ),
                impact=(
                    "Credentials are exposed to any network observer. "
                    "An attacker performing a man-in-the-middle attack can "
                    "harvest email passwords."
                ),
                recommendation=(
                    "Enforce TLS before authentication. Use SMTPS (port 465), "
                    "IMAPS (port 993), or POP3S (port 995), or require "
                    "STARTTLS upgrade before any AUTH command."
                ),
            ))

        if cd is None:
            # No crypto details at all — count as unencrypted
            tls_counts.unencrypted += 1
            if session.protocol not in ("OTHER", "UNKNOWN"):
                findings.append(Finding(
                    severity=Severity.CRITICAL,
                    title="Unencrypted Email Session",
                    description=(
                        f"Session {sid} to {host} uses {session.protocol} "
                        f"without any TLS encryption."
                    ),
                    evidence=f"No TLS handshake detected on port {session.dst_port}.",
                    impact=(
                        "All email content, headers, and attachments are "
                        "transmitted in cleartext and can be intercepted."
                    ),
                    recommendation=(
                        "Enable TLS on the mail server. Use implicit TLS "
                        "(ports 465/993/995) or enforce STARTTLS."
                    ),
                ))
            return findings

        tls_ver = cd.tls_version

        # ── TLS version accounting ────────────────────────────────────
        if tls_ver == "TLSv1.3":
            tls_counts.tls_1_3 += 1
        elif tls_ver == "TLSv1.2":
            tls_counts.tls_1_2 += 1
        elif tls_ver == "TLSv1.1":
            tls_counts.tls_1_1 += 1
        elif tls_ver == "TLSv1.0":
            tls_counts.tls_1_0 += 1
        elif tls_ver in ("SSLv3", "SSLv2"):
            tls_counts.ssl += 1
        elif tls_ver in ("None", "", None):
            tls_counts.unencrypted += 1
        else:
            tls_counts.unencrypted += 1

        # ── Deprecated TLS ────────────────────────────────────────────
        tls_status = TLSAnalyzer.analyze_version(tls_ver)
        if tls_status == "Insecure":
            findings.append(Finding(
                severity=Severity.CRITICAL,
                title="Severely Outdated TLS Version",
                description=(
                    f"Session {sid} negotiated {tls_ver} with {host}. "
                    f"This version has known cryptographic vulnerabilities "
                    f"including BEAST, POODLE, and CRIME attacks."
                ),
                evidence=f"TLS handshake ServerHello: version={tls_ver}",
                impact=(
                    "An attacker can exploit known protocol-level "
                    "vulnerabilities to decrypt traffic or inject content."
                ),
                recommendation=(
                    "Disable TLS 1.0 and TLS 1.1 on the mail server. "
                    "Require TLS 1.2 as minimum, prefer TLS 1.3."
                ),
            ))
        elif tls_status == "Deprecated":
            findings.append(Finding(
                severity=Severity.HIGH,
                title="Deprecated TLS Version Detected",
                description=(
                    f"Session {sid} negotiated {tls_ver} with {host}. "
                    f"TLS 1.1 was deprecated by RFC 8996 in March 2021."
                ),
                evidence=f"TLS handshake ServerHello: version={tls_ver}",
                impact=(
                    "While fewer known attacks exist than TLS 1.0, this "
                    "version lacks modern cipher suite support and is "
                    "considered deprecated by all major standards bodies."
                ),
                recommendation=(
                    "Upgrade server TLS configuration to require TLS 1.2 "
                    "minimum. Configure TLS 1.3 support."
                ),
            ))

        # ── Weak cipher ───────────────────────────────────────────────
        cipher = cd.cipher_suite
        cipher_strength = TLSAnalyzer.evaluate_cipher_strength(cipher)
        if cipher_strength == "Weak":
            findings.append(Finding(
                severity=Severity.HIGH,
                title="Weak Cipher Suite Negotiated",
                description=(
                    f"Session {sid} with {host} negotiated cipher "
                    f"'{cipher}' which uses known-weak algorithms."
                ),
                evidence=f"TLS handshake: cipher_suite={cipher}",
                impact=(
                    "Weak ciphers such as RC4, DES, and 3DES have known "
                    "cryptanalytic attacks. Traffic may be decryptable "
                    "by a sufficiently resourced adversary."
                ),
                recommendation=(
                    "Configure the mail server to prioritise AES-GCM and "
                    "ChaCha20-Poly1305 cipher suites. Disable RC4, DES, "
                    "3DES, and export ciphers."
                ),
            ))

        # ── Certificate: expired ──────────────────────────────────────
        if cd.cert_expired:
            findings.append(Finding(
                severity=Severity.HIGH,
                title="Expired TLS Certificate",
                description=(
                    f"The certificate presented by {host} in session {sid} "
                    f"expired on {cd.cert_expiry_date or 'unknown date'}."
                ),
                evidence=(
                    f"Certificate expiry: {cd.cert_expiry_date}, "
                    f"Issuer: {cd.cert_issuer or 'N/A'}"
                ),
                impact=(
                    "Expired certificates break trust validation. Clients "
                    "may either reject the connection or, if configured to "
                    "ignore errors, become vulnerable to MITM attacks."
                ),
                recommendation=(
                    "Renew the certificate immediately with a trusted CA. "
                    "Implement certificate expiry monitoring and automated "
                    "renewal (e.g. via ACME / Let's Encrypt)."
                ),
            ))

        # ── Certificate: self-signed ──────────────────────────────────
        if cd.self_signed:
            findings.append(Finding(
                severity=Severity.HIGH,
                title="Self-Signed Certificate",
                description=(
                    f"Session {sid} with {host} presented a self-signed "
                    f"certificate not issued by a trusted CA."
                ),
                evidence=f"Certificate issuer: {cd.cert_issuer or 'Self-Signed'}",
                impact=(
                    "Self-signed certificates cannot be verified by clients "
                    "against a trusted root store, making MITM attacks trivial."
                ),
                recommendation=(
                    "Obtain a certificate from a trusted Certificate Authority. "
                    "Free options include Let's Encrypt."
                ),
            ))

        # ── Certificate: invalid ──────────────────────────────────────
        if not cd.cert_valid and not cd.cert_expired and not cd.self_signed:
            findings.append(Finding(
                severity=Severity.HIGH,
                title="Invalid TLS Certificate",
                description=(
                    f"The certificate for {host} in session {sid} failed "
                    f"validation checks."
                ),
                evidence=f"cert_valid=false, issuer={cd.cert_issuer or 'N/A'}",
                impact="Clients cannot establish trust with this server.",
                recommendation="Investigate and replace the certificate.",
            ))

        # ── Hostname / SNI mismatch ───────────────────────────────────
        if not cd.hostname_match:
            findings.append(Finding(
                severity=Severity.HIGH,
                title="Certificate Hostname Mismatch",
                description=(
                    f"The certificate presented by {host} does not match "
                    f"the server's SNI hostname "
                    f"'{cd.sni_hostname or session.dst_ip}'."
                ),
                evidence=(
                    f"SNI: {cd.sni_hostname or 'N/A'}, "
                    f"Certificate CN does not match"
                ),
                impact=(
                    "A hostname mismatch may indicate a misconfigured server "
                    "or a MITM attack using a certificate for a different domain."
                ),
                recommendation=(
                    "Ensure the certificate's Common Name or Subject "
                    "Alternative Names match the mail server hostname."
                ),
            ))

        # ── Certificate chain invalid ─────────────────────────────────
        if not cd.chain_valid and cd.tls_version not in ("None", "", None):
            findings.append(Finding(
                severity=Severity.MEDIUM,
                title="Incomplete Certificate Chain",
                description=(
                    f"Session {sid} with {host}: the certificate chain "
                    f"could not be fully validated to a trusted root CA."
                ),
                evidence="chain_valid=false",
                impact=(
                    "Clients may reject the connection or display warnings "
                    "if intermediate certificates are missing."
                ),
                recommendation=(
                    "Configure the server to send the full certificate chain "
                    "including all intermediate certificates."
                ),
            ))

        # ── Weak key size ─────────────────────────────────────────────
        key_status = CertificateAnalyzer.analyze_key_size(cd.key_size)
        if key_status == "Weak":
            findings.append(Finding(
                severity=Severity.MEDIUM,
                title="Weak Certificate Key Size",
                description=(
                    f"Session {sid} with {host} uses an RSA key of only "
                    f"{cd.key_size} bits."
                ),
                evidence=f"Certificate key_size={cd.key_size} bits",
                impact=(
                    "RSA keys below 2048 bits are considered factorable "
                    "by well-resourced adversaries (NIST SP 800-131A)."
                ),
                recommendation=(
                    "Generate a new key pair with at least 2048-bit RSA "
                    "or 256-bit ECDSA."
                ),
            ))

        # ── Weak signature algorithm ──────────────────────────────────
        sig_status = CertificateAnalyzer.evaluate_signature_algorithm(cd.signature_algorithm)
        if sig_status == "Weak":
            findings.append(Finding(
                severity=Severity.MEDIUM,
                title="Weak Certificate Signature Algorithm",
                description=(
                    f"Session {sid} with {host} uses signature algorithm "
                    f"'{cd.signature_algorithm}' which relies on a weak hash."
                ),
                evidence=f"signature_algorithm={cd.signature_algorithm}",
                impact=(
                    "SHA-1 and MD5 are vulnerable to collision attacks. "
                    "Certificates signed with weak hashes can be forged."
                ),
                recommendation=(
                    "Re-issue the certificate using SHA-256 or stronger "
                    "signature algorithm."
                ),
            ))

        # ── STARTTLS not used on submission port ──────────────────────
        if session.dst_port in (25, 587) and not cd.starttls_used and tls_ver in ("None", "", None):
            findings.append(Finding(
                severity=Severity.HIGH,
                title="STARTTLS Not Used on SMTP Submission",
                description=(
                    f"Session {sid} to {host}:{session.dst_port} did not "
                    f"upgrade to TLS via STARTTLS."
                ),
                evidence=f"No STARTTLS command observed on port {session.dst_port}",
                impact=(
                    "Email is transmitted in cleartext, allowing eavesdropping "
                    "and credential theft."
                ),
                recommendation=(
                    "Configure the mail server to require STARTTLS on ports "
                    "25 and 587. Better yet, use implicit TLS on port 465."
                ),
            ))

        return findings

    # ── Recommendation aggregation ────────────────────────────────────────

    @staticmethod
    def _generate_recommendations(findings: list[Finding]) -> list[str]:
        """De-duplicate and prioritise recommendations from findings."""
        seen = set()
        recs = []
        # Sort by severity (CRITICAL first)
        severity_order = {
            Severity.CRITICAL: 0,
            Severity.HIGH: 1,
            Severity.MEDIUM: 2,
            Severity.LOW: 3,
            Severity.INFO: 4,
        }
        for f in sorted(findings, key=lambda x: severity_order.get(x.severity, 5)):
            if f.recommendation and f.recommendation not in seen:
                seen.add(f.recommendation)
                recs.append(f.recommendation)
        return recs
