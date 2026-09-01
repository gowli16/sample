"""
SecureMailScope — Sample demo scenarios.

Each scenario provides realistic mock packet data to demonstrate
different security postures.  The data structures mirror what a
real TShark / Zeek integration would produce.

Five scenarios:
  1. secure_smtp       → TLS 1.3, strong cipher, valid cert → LOW risk
  2. legacy_tls        → TLS 1.0, weak cipher               → HIGH / CRITICAL risk
  3. certificate_problem → TLS 1.2, expired cert, self-signed  → HIGH risk
  4. plaintext_email   → No TLS at all, plaintext auth       → CRITICAL risk
  5. unsupported_pcap  → 802.11 / non-email traffic          → NOT APPLICABLE
"""

SCENARIOS = {
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Scenario 1: Secure SMTP – modern TLS, strong cipher, valid certificate
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    "secure_smtp": {
        "raw_packets": [
            # Session A — SMTP submission with STARTTLS upgrade
            {
                "src_ip": "192.168.1.100", "dst_ip": "10.0.0.5",
                "src_port": 54321, "dst_port": 587,
                "protocol": "TCP", "length": 1524,
                "hostname": "mail.securecorp.com",
                "crypto": {
                    "tls_version": "TLSv1.3",
                    "cipher_suite": "TLS_AES_256_GCM_SHA384",
                    "starttls_used": True,
                    "cert_valid": True,
                    "cert_expired": False,
                    "self_signed": False,
                    "hostname_match": True,
                    "key_size": 4096,
                    "signature_algorithm": "SHA256WithRSA",
                    "chain_valid": True,
                    "handshake_status": "Successful",
                    "cert_expiry_date": "2027-06-15",
                    "cert_issuer": "Let's Encrypt Authority X3",
                    "sni_hostname": "mail.securecorp.com"
                },
                "has_plaintext_auth": False
            },
            # Session B — SMTPS (implicit TLS)
            {
                "src_ip": "192.168.1.101", "dst_ip": "10.0.0.5",
                "src_port": 54322, "dst_port": 465,
                "protocol": "TCP", "length": 2048,
                "hostname": "mail.securecorp.com",
                "crypto": {
                    "tls_version": "TLSv1.3",
                    "cipher_suite": "TLS_CHACHA20_POLY1305_SHA256",
                    "starttls_used": False,
                    "cert_valid": True,
                    "cert_expired": False,
                    "self_signed": False,
                    "hostname_match": True,
                    "key_size": 4096,
                    "signature_algorithm": "SHA256WithRSA",
                    "chain_valid": True,
                    "handshake_status": "Successful",
                    "cert_expiry_date": "2027-06-15",
                    "cert_issuer": "Let's Encrypt Authority X3",
                    "sni_hostname": "mail.securecorp.com"
                },
                "has_plaintext_auth": False
            },
            # Session C — IMAPS
            {
                "src_ip": "192.168.1.102", "dst_ip": "10.0.0.5",
                "src_port": 54323, "dst_port": 993,
                "protocol": "TCP", "length": 3200,
                "hostname": "imap.securecorp.com",
                "crypto": {
                    "tls_version": "TLSv1.3",
                    "cipher_suite": "TLS_AES_128_GCM_SHA256",
                    "starttls_used": False,
                    "cert_valid": True,
                    "cert_expired": False,
                    "self_signed": False,
                    "hostname_match": True,
                    "key_size": 2048,
                    "signature_algorithm": "SHA256WithRSA",
                    "chain_valid": True,
                    "handshake_status": "Successful",
                    "cert_expiry_date": "2027-08-20",
                    "cert_issuer": "DigiCert Inc",
                    "sni_hostname": "imap.securecorp.com"
                },
                "has_plaintext_auth": False
            },
            # Session D — POP3S
            {
                "src_ip": "192.168.1.103", "dst_ip": "10.0.0.5",
                "src_port": 54324, "dst_port": 995,
                "protocol": "TCP", "length": 1800,
                "hostname": "pop.securecorp.com",
                "crypto": {
                    "tls_version": "TLSv1.2",
                    "cipher_suite": "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
                    "starttls_used": False,
                    "cert_valid": True,
                    "cert_expired": False,
                    "self_signed": False,
                    "hostname_match": True,
                    "key_size": 2048,
                    "signature_algorithm": "SHA256WithRSA",
                    "chain_valid": True,
                    "handshake_status": "Successful",
                    "cert_expiry_date": "2027-08-20",
                    "cert_issuer": "DigiCert Inc",
                    "sni_hostname": "pop.securecorp.com"
                },
                "has_plaintext_auth": False
            },
        ]
    },

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Scenario 2: Legacy TLS – TLS 1.0, weak cipher, weak hash
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    "legacy_tls": {
        "raw_packets": [
            # Session A — IMAP with TLS 1.0 and RC4 cipher
            {
                "src_ip": "192.168.1.200", "dst_ip": "10.0.0.20",
                "src_port": 55001, "dst_port": 993,
                "protocol": "TCP", "length": 1200,
                "hostname": "legacy-mail.oldcorp.com",
                "crypto": {
                    "tls_version": "TLSv1.0",
                    "cipher_suite": "TLS_RSA_WITH_RC4_128_SHA",
                    "starttls_used": False,
                    "cert_valid": True,
                    "cert_expired": False,
                    "self_signed": False,
                    "hostname_match": True,
                    "key_size": 1024,
                    "signature_algorithm": "SHA1WithRSA",
                    "chain_valid": True,
                    "handshake_status": "Successful",
                    "cert_expiry_date": "2027-01-10",
                    "cert_issuer": "GoDaddy",
                    "sni_hostname": "legacy-mail.oldcorp.com"
                },
                "has_plaintext_auth": False
            },
            # Session B — SMTP with TLS 1.0 and DES cipher
            {
                "src_ip": "192.168.1.201", "dst_ip": "10.0.0.20",
                "src_port": 55002, "dst_port": 25,
                "protocol": "TCP", "length": 900,
                "hostname": "smtp.oldcorp.com",
                "crypto": {
                    "tls_version": "TLSv1.0",
                    "cipher_suite": "TLS_RSA_WITH_3DES_EDE_CBC_SHA",
                    "starttls_used": True,
                    "cert_valid": True,
                    "cert_expired": False,
                    "self_signed": False,
                    "hostname_match": False,
                    "key_size": 1024,
                    "signature_algorithm": "SHA1WithRSA",
                    "chain_valid": True,
                    "handshake_status": "Successful",
                    "cert_expiry_date": "2027-01-10",
                    "cert_issuer": "GoDaddy",
                    "sni_hostname": "smtp.oldcorp.com"
                },
                "has_plaintext_auth": False
            },
            # Session C — SMTP with TLS 1.1 (deprecated)
            {
                "src_ip": "192.168.1.202", "dst_ip": "10.0.0.21",
                "src_port": 55003, "dst_port": 587,
                "protocol": "TCP", "length": 1100,
                "hostname": "mail.oldcorp.com",
                "crypto": {
                    "tls_version": "TLSv1.1",
                    "cipher_suite": "TLS_RSA_WITH_AES_128_CBC_SHA",
                    "starttls_used": True,
                    "cert_valid": True,
                    "cert_expired": False,
                    "self_signed": False,
                    "hostname_match": True,
                    "key_size": 2048,
                    "signature_algorithm": "SHA1WithRSA",
                    "chain_valid": True,
                    "handshake_status": "Successful",
                    "cert_expiry_date": "2027-05-22",
                    "cert_issuer": "GoDaddy",
                    "sni_hostname": "mail.oldcorp.com"
                },
                "has_plaintext_auth": False
            },
        ]
    },

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Scenario 3: Certificate problems — expired, self-signed, hostname mismatch
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    "certificate_problem": {
        "raw_packets": [
            # Session A — SMTPS with expired self-signed cert
            {
                "src_ip": "192.168.1.50", "dst_ip": "10.0.0.7",
                "src_port": 54323, "dst_port": 465,
                "protocol": "TCP", "length": 1800,
                "hostname": "mail.example.com",
                "crypto": {
                    "tls_version": "TLSv1.2",
                    "cipher_suite": "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
                    "starttls_used": False,
                    "cert_valid": False,
                    "cert_expired": True,
                    "self_signed": True,
                    "hostname_match": False,
                    "key_size": 2048,
                    "signature_algorithm": "SHA256WithRSA",
                    "chain_valid": False,
                    "handshake_status": "Completed with warnings",
                    "cert_expiry_date": "2024-11-30",
                    "cert_issuer": "Self-Signed",
                    "sni_hostname": "mail.example.com"
                },
                "has_plaintext_auth": False
            },
            # Session B — SMTP with STARTTLS and hostname mismatch
            {
                "src_ip": "192.168.1.51", "dst_ip": "10.0.0.7",
                "src_port": 54330, "dst_port": 587,
                "protocol": "TCP", "length": 1600,
                "hostname": "smtp.example.com",
                "crypto": {
                    "tls_version": "TLSv1.2",
                    "cipher_suite": "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
                    "starttls_used": True,
                    "cert_valid": True,
                    "cert_expired": False,
                    "self_signed": False,
                    "hostname_match": False,
                    "key_size": 2048,
                    "signature_algorithm": "SHA256WithRSA",
                    "chain_valid": True,
                    "handshake_status": "Successful",
                    "cert_expiry_date": "2027-09-15",
                    "cert_issuer": "Comodo CA",
                    "sni_hostname": "smtp.example.com"
                },
                "has_plaintext_auth": False
            },
            # Session C — IMAPS with weak key size
            {
                "src_ip": "192.168.1.52", "dst_ip": "10.0.0.8",
                "src_port": 54335, "dst_port": 993,
                "protocol": "TCP", "length": 2400,
                "hostname": "imap.example.com",
                "crypto": {
                    "tls_version": "TLSv1.2",
                    "cipher_suite": "TLS_RSA_WITH_AES_256_CBC_SHA256",
                    "starttls_used": False,
                    "cert_valid": True,
                    "cert_expired": False,
                    "self_signed": False,
                    "hostname_match": True,
                    "key_size": 1024,
                    "signature_algorithm": "SHA1WithRSA",
                    "chain_valid": True,
                    "handshake_status": "Successful",
                    "cert_expiry_date": "2027-07-10",
                    "cert_issuer": "Comodo CA",
                    "sni_hostname": "imap.example.com"
                },
                "has_plaintext_auth": False
            },
        ]
    },

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Scenario 4: Plaintext email – no TLS, plaintext authentication
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    "plaintext_email": {
        "raw_packets": [
            # Session A — SMTP on port 25 with no TLS
            {
                "src_ip": "192.168.1.103", "dst_ip": "10.0.0.8",
                "src_port": 54340, "dst_port": 25,
                "protocol": "TCP", "length": 800,
                "hostname": "smtp.insecure-org.com",
                "crypto": {
                    "tls_version": "None",
                    "cipher_suite": "None",
                    "starttls_used": False,
                    "cert_valid": False,
                    "cert_expired": False,
                    "self_signed": False,
                    "hostname_match": False,
                    "key_size": 0,
                    "signature_algorithm": "None",
                    "chain_valid": False,
                    "handshake_status": "No TLS",
                    "cert_expiry_date": None,
                    "cert_issuer": None,
                    "sni_hostname": None
                },
                "has_plaintext_auth": True
            },
            # Session B — POP3 on port 110 with no TLS
            {
                "src_ip": "192.168.1.104", "dst_ip": "10.0.0.8",
                "src_port": 54341, "dst_port": 110,
                "protocol": "TCP", "length": 600,
                "hostname": "pop.insecure-org.com",
                "crypto": {
                    "tls_version": "None",
                    "cipher_suite": "None",
                    "starttls_used": False,
                    "cert_valid": False,
                    "cert_expired": False,
                    "self_signed": False,
                    "hostname_match": False,
                    "key_size": 0,
                    "signature_algorithm": "None",
                    "chain_valid": False,
                    "handshake_status": "No TLS",
                    "cert_expiry_date": None,
                    "cert_issuer": None,
                    "sni_hostname": None
                },
                "has_plaintext_auth": True
            },
            # Session C — IMAP on port 143 with no TLS
            {
                "src_ip": "192.168.1.105", "dst_ip": "10.0.0.9",
                "src_port": 54342, "dst_port": 143,
                "protocol": "TCP", "length": 750,
                "hostname": "imap.insecure-org.com",
                "crypto": {
                    "tls_version": "None",
                    "cipher_suite": "None",
                    "starttls_used": False,
                    "cert_valid": False,
                    "cert_expired": False,
                    "self_signed": False,
                    "hostname_match": False,
                    "key_size": 0,
                    "signature_algorithm": "None",
                    "chain_valid": False,
                    "handshake_status": "No TLS",
                    "cert_expiry_date": None,
                    "cert_issuer": None,
                    "sni_hostname": None
                },
                "has_plaintext_auth": True
            },
        ]
    },

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # Scenario 5: Unsupported PCAP – only non-email traffic
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    "unsupported_pcap": {
        "raw_packets": [
            # 802.11 beacon frame (Wi-Fi management)
            {
                "src_ip": "0.0.0.0", "dst_ip": "255.255.255.255",
                "src_port": 0, "dst_port": 0,
                "protocol": "802.11", "length": 200,
                "traffic_label": "802.11 Wi-Fi Management"
            },
            # DNS query
            {
                "src_ip": "192.168.1.1", "dst_ip": "8.8.8.8",
                "src_port": 53421, "dst_port": 53,
                "protocol": "UDP", "length": 120,
                "traffic_label": "DNS"
            },
            # HTTP traffic
            {
                "src_ip": "192.168.1.1", "dst_ip": "93.184.216.34",
                "src_port": 54000, "dst_port": 80,
                "protocol": "TCP", "length": 1400,
                "traffic_label": "HTTP"
            },
            # HTTPS traffic (not email)
            {
                "src_ip": "192.168.1.1", "dst_ip": "93.184.216.34",
                "src_port": 54001, "dst_port": 443,
                "protocol": "TCP", "length": 3200,
                "traffic_label": "HTTPS"
            },
        ]
    },
}
