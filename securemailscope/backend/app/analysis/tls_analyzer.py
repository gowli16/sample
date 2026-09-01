class TLSAnalyzer:
    @staticmethod
    def analyze_version(version: str) -> str:
        if version == "TLSv1.3":
            return "Secure"
        elif version == "TLSv1.2":
            return "Acceptable"
        elif version == "TLSv1.1":
            return "Deprecated"
        elif version in ["TLSv1.0", "SSLv3", "SSLv2"]:
            return "Insecure"
        else:
            return "Critical"

    @staticmethod
    def evaluate_cipher_strength(cipher: str) -> str:
        if not cipher or cipher == "None":
            return "None"
        if "RC4" in cipher or "DES" in cipher or "MD5" in cipher:
            return "Weak"
        if "AES" in cipher and "GCM" in cipher:
            return "Strong"
        return "Acceptable"

    @staticmethod
    def check_starttls(starttls_used: bool, tls_version: str) -> bool:
        # Returns True if STARTTLS was used OR if it's a direct TLS connection
        return starttls_used or tls_version not in ["None", ""]
