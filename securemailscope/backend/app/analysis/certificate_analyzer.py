class CertificateAnalyzer:
    @staticmethod
    def analyze_key_size(key_size: int, is_ecc: bool = False) -> str:
        if is_ecc:
            if key_size >= 256:
                return "Secure"
            return "Weak"
        else:
            if key_size >= 2048:
                return "Secure"
            elif key_size >= 1024:
                return "Acceptable"
            return "Weak"

    @staticmethod
    def check_validity(cert_valid: bool, cert_expired: bool, self_signed: bool, chain_valid: bool) -> bool:
        return cert_valid and not cert_expired and not self_signed and chain_valid

    @staticmethod
    def evaluate_signature_algorithm(algo: str) -> str:
        if "SHA1" in algo or "MD5" in algo:
            return "Weak"
        if "SHA256" in algo or "SHA384" in algo:
            return "Strong"
        return "Acceptable"
