"""
SecureMailScope — TCP session reconstruction.

Groups raw packets by 5-tuple into logical email sessions,
extracting metadata and crypto details.

In a real deployment this would reconstruct TCP streams from
actual packet data.  The mock implementation works from the
structured packet dicts produced by MockPcapParser.
"""

import uuid
from typing import List, Dict

from app.models.schemas import SessionInfo, CryptoDetails, TLSSummary
from app.analysis.protocol_detector import ProtocolDetector


class SessionReconstructor:
    """Reconstruct email sessions from raw packet records."""

    @staticmethod
    def reconstruct(raw_packets: List[dict]) -> List[SessionInfo]:
        """
        Group packets into sessions by 5-tuple.

        In a real implementation this would:
          1. Re-assemble TCP streams using sequence numbers.
          2. Parse SMTP/IMAP/POP3 command–response pairs.
          3. Detect STARTTLS upgrade points.
          4. Extract TLS handshake parameters from ClientHello / ServerHello.

        The mock implementation reads pre-structured fields from the
        scenario data produced by MockPcapParser.
        """
        sessions_map: Dict[str, dict] = {}

        for packet in raw_packets:
            src_ip = packet.get("src_ip", "0.0.0.0")
            dst_ip = packet.get("dst_ip", "0.0.0.0")
            src_port = packet.get("src_port", 0)
            dst_port = packet.get("dst_port", 0)
            proto_str = packet.get("protocol", "TCP")

            # Build a normalised 5-tuple key
            if (src_ip, src_port) < (dst_ip, dst_port):
                key = f"{src_ip}:{src_port}-{dst_ip}:{dst_port}-{proto_str}"
                client_ip, server_ip = src_ip, dst_ip
                server_port = dst_port
            else:
                key = f"{dst_ip}:{dst_port}-{src_ip}:{src_port}-{proto_str}"
                client_ip, server_ip = dst_ip, src_ip
                server_port = src_port

            if key not in sessions_map:
                protocol = (
                    ProtocolDetector.EMAIL_PORTS.get(dst_port)
                    or ProtocolDetector.EMAIL_PORTS.get(src_port)
                    or "OTHER"
                )
                sessions_map[key] = {
                    "id": str(uuid.uuid4())[:8],
                    "src_ip": client_ip,
                    "dst_ip": server_ip,
                    "dst_port": server_port,
                    "protocol": protocol,
                    "hostname": packet.get("hostname"),
                    "bytes_transferred": 0,
                    "duration_ms": 0,
                    "packets": [],
                }

            sessions_map[key]["bytes_transferred"] += packet.get("length", 0)
            sessions_map[key]["packets"].append(packet)

        # Build SessionInfo objects
        sessions: List[SessionInfo] = []
        for idx, (key, s_data) in enumerate(sessions_map.items(), start=1):
            # Simulate realistic duration from packet count
            s_data["duration_ms"] = len(s_data["packets"]) * 120 + 50

            session = SessionInfo(
                id=s_data["id"],
                src_ip=s_data["src_ip"],
                dst_ip=s_data["dst_ip"],
                dst_port=s_data["dst_port"],
                protocol=s_data["protocol"],
                hostname=s_data.get("hostname"),
                bytes_transferred=s_data["bytes_transferred"],
                duration_ms=s_data["duration_ms"],
            )

            # Extract crypto details from first packet (mock)
            # ─── In real implementation: parse TLS handshake from reassembled stream
            first_pkt = s_data["packets"][0] if s_data["packets"] else {}
            if "crypto" in first_pkt:
                c = first_pkt["crypto"]
                session.crypto_details = CryptoDetails(
                    tls_version=c.get("tls_version", "None"),
                    cipher_suite=c.get("cipher_suite", "None"),
                    starttls_used=c.get("starttls_used", False),
                    cert_valid=c.get("cert_valid", False),
                    cert_expired=c.get("cert_expired", False),
                    self_signed=c.get("self_signed", False),
                    hostname_match=c.get("hostname_match", False),
                    key_size=c.get("key_size", 0),
                    signature_algorithm=c.get("signature_algorithm", "Unknown"),
                    chain_valid=c.get("chain_valid", False),
                    handshake_status=c.get("handshake_status", "Unknown"),
                    cert_expiry_date=c.get("cert_expiry_date"),
                    cert_issuer=c.get("cert_issuer"),
                    sni_hostname=c.get("sni_hostname"),
                )

                # Derive TLS summary
                session.tls_summary = TLSSummary(
                    version=c.get("tls_version", "None"),
                    cipher_suite=c.get("cipher_suite", "None"),
                    starttls_used=c.get("starttls_used", False),
                    is_secure=c.get("tls_version") in ("TLSv1.2", "TLSv1.3"),
                )

            if "has_plaintext_auth" in first_pkt:
                session.has_plaintext_auth = first_pkt["has_plaintext_auth"]

            sessions.append(session)

        return sessions
