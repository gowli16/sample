from typing import List, Dict, Any
from app.models.schemas import SessionInfo

class FeatureExtractor:
    FEATURE_NAMES = [
        "protocol_encoded", "port", "tls_version_encoded", "cipher_strength",
        "starttls_offered", "starttls_used", "cert_valid", "cert_expired",
        "cert_self_signed", "hostname_match", "chain_valid", "key_size_normalized",
        "sig_algo_strength", "handshake_success", "plaintext_auth", "downgrade_indicator"
    ]

    @staticmethod
    def extract_features(session: SessionInfo) -> List[float]:
        # Encode protocol
        proto_map = {"SMTP": 1, "SMTPS": 2, "IMAP": 3, "IMAPS": 4, "POP3": 5, "POP3S": 6, "OTHER": 0}
        protocol_encoded = proto_map.get(session.protocol, 0)
        
        port = session.dst_port
        
        if session.crypto_details:
            c = session.crypto_details
            tls_map = {"TLSv1.3": 4, "TLSv1.2": 3, "TLSv1.1": 2, "TLSv1.0": 1, "None": 0}
            tls_version_encoded = tls_map.get(c.tls_version, 0)
            
            cipher_str = c.cipher_suite
            if "RC4" in cipher_str or "DES" in cipher_str:
                cipher_strength = 1
            elif "AES" in cipher_str and "GCM" in cipher_str:
                cipher_strength = 3
            elif cipher_str != "None":
                cipher_strength = 2
            else:
                cipher_strength = 0
                
            starttls_offered = 1 if c.tls_version != "None" else 0
            starttls_used = 1 if (session.tls_summary and session.tls_summary.starttls_used) else 0
            cert_valid = 1 if c.cert_valid else 0
            cert_expired = 1 if c.cert_expired else 0
            cert_self_signed = 1 if c.self_signed else 0
            hostname_match = 1 if c.hostname_match else 0
            chain_valid = 1 if c.chain_valid else 0
            key_size_normalized = min(c.key_size / 2048.0, 2.0)
            
            sig = c.signature_algorithm
            if "SHA1" in sig or "MD5" in sig:
                sig_algo_strength = 1
            elif "SHA256" in sig or "SHA384" in sig:
                sig_algo_strength = 3
            else:
                sig_algo_strength = 2
                
            handshake_success = 1 if c.tls_version != "None" else 0
        else:
            tls_version_encoded = 0
            cipher_strength = 0
            starttls_offered = 0
            starttls_used = 0
            cert_valid = 0
            cert_expired = 0
            cert_self_signed = 0
            hostname_match = 0
            chain_valid = 0
            key_size_normalized = 0.0
            sig_algo_strength = 0
            handshake_success = 0

        plaintext_auth = 1 if session.has_plaintext_auth else 0
        downgrade_indicator = 1 if (tls_version_encoded in [1, 2]) else 0

        features = [
            float(protocol_encoded), float(port), float(tls_version_encoded), float(cipher_strength),
            float(starttls_offered), float(starttls_used), float(cert_valid), float(cert_expired),
            float(cert_self_signed), float(hostname_match), float(chain_valid), float(key_size_normalized),
            float(sig_algo_strength), float(handshake_success), float(plaintext_auth), float(downgrade_indicator)
        ]
        return features
