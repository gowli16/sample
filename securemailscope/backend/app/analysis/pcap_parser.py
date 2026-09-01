import abc
import struct
import os
import nest_asyncio
nest_asyncio.apply()

class PcapParserInterface(abc.ABC):
    @abc.abstractmethod
    def parse(self, filepath: str) -> dict:
        pass

class MockPcapParser(PcapParserInterface):
    def parse(self, filepath: str) -> dict:
        # Validate magic bytes
        with open(filepath, 'rb') as f:
            magic = f.read(4)
            if magic not in [b'\xd4\xc3\xb2\xa1', b'\xa1\xb2\xc3\xd4', b'\x0a\x0d\x0d\x0a']:
                raise ValueError("Invalid PCAP/PCAPNG file format")

        file_size = os.path.getsize(filepath)
        
        # Use heuristics to select demo scenario (mocking real parsing)
        from data.sample_scenarios import SCENARIOS
        if file_size < 1024:
            return SCENARIOS["unsupported_pcap"]["raw_packets"]
        elif file_size < 2048:
            return SCENARIOS["plaintext_email"]["raw_packets"]
        elif file_size < 3072:
            return SCENARIOS["certificate_problem"]["raw_packets"]
        elif file_size < 4096:
            return SCENARIOS["legacy_tls"]["raw_packets"]
        else:
            return SCENARIOS["secure_smtp"]["raw_packets"]

class TSharkPcapParser(PcapParserInterface):
    def parse(self, filepath: str) -> dict:
        import pyshark
        print(f"Parsing PCAP with TShark/pyshark: {filepath}")
        
        # We need to capture both the regular packets and try to group them.
        cap = pyshark.FileCapture(filepath, include_raw=False) # use_json occasionally has issues depending on tshark version
        raw_packets = []
        
        try:
            for packet in cap:
                if not hasattr(packet, 'ip') and not hasattr(packet, 'ipv6'):
                    continue
                
                if hasattr(packet, 'ip'):
                    src_ip = packet.ip.src
                    dst_ip = packet.ip.dst
                else:
                    src_ip = packet.ipv6.src
                    dst_ip = packet.ipv6.dst
                
                if not hasattr(packet, 'tcp') and not hasattr(packet, 'udp'):
                    continue
                
                protocol = "TCP" if hasattr(packet, 'tcp') else "UDP"
                if protocol == "TCP":
                    src_port = int(packet.tcp.srcport)
                    dst_port = int(packet.tcp.dstport)
                else:
                    src_port = int(packet.udp.srcport)
                    dst_port = int(packet.udp.dstport)
                    
                length = int(packet.length) if hasattr(packet, 'length') else 0
                
                crypto = None
                hostname = None
                has_plaintext_auth = False
                
                if hasattr(packet, 'tls'):
                    tls_version = getattr(packet.tls, 'handshake_version', None) 
                    cipher_suite = getattr(packet.tls, 'handshake_ciphersuite', None)
                    
                    if tls_version:
                        tls_map = {"0x0304": "TLSv1.3", "0x0303": "TLSv1.2", "0x0302": "TLSv1.1", "0x0301": "TLSv1.0"}
                        tls_version = tls_map.get(tls_version, tls_version)
                    
                    crypto = {
                        "tls_version": tls_version or "Unknown",
                        "cipher_suite": cipher_suite or "Unknown",
                        "starttls_used": getattr(packet.tls, 'record_version', None) is not None,
                        "cert_valid": True,
                        "cert_expired": False,
                        "self_signed": False,
                        "hostname_match": True,
                        "key_size": 2048,
                        "signature_algorithm": "SHA256WithRSA",
                        "chain_valid": True,
                        "handshake_status": "Successful"
                    }
                    
                    hostname = getattr(packet.tls, 'handshake_extensions_server_name', None)

                packet_dict = {
                    "src_ip": src_ip,
                    "dst_ip": dst_ip,
                    "src_port": src_port,
                    "dst_port": dst_port,
                    "protocol": protocol,
                    "length": length,
                }
                
                if hostname:
                    packet_dict["hostname"] = hostname
                if crypto:
                    packet_dict["crypto"] = crypto
                packet_dict["has_plaintext_auth"] = has_plaintext_auth
                    
                raw_packets.append(packet_dict)
        except Exception as e:
            print(f"Pyshark parsing error (Make sure TShark/Wireshark is installed): {e}")
            raise e
        finally:
            cap.close()
            
        return raw_packets

class ZeekPcapParser(PcapParserInterface):
    def parse(self, filepath: str) -> dict:
        import json
        import subprocess
        import tempfile
        import os

        print(f"Parsing PCAP with Zeek: {filepath}")
        raw_packets = []
        
        with tempfile.TemporaryDirectory() as tmpdir:
            try:
                # Run zeek in the temp directory so it dumps logs there
                # LogAscii::use_json=T ensures logs are in JSON format
                subprocess.run(
                    ['zeek', '-r', os.path.abspath(filepath), 'LogAscii::use_json=T'],
                    cwd=tmpdir,
                    check=True,
                    capture_output=True
                )
            except subprocess.CalledProcessError as e:
                print(f"Zeek parsing error: {e.stderr.decode()}")
                raise RuntimeError(f"Zeek failed to run: {e.stderr.decode()}") from e
            except FileNotFoundError:
                raise RuntimeError("Zeek command not found. Please ensure you are on Kali Linux and ran 'sudo apt install zeek'.")
            
            conn_log_path = os.path.join(tmpdir, "conn.log")
            ssl_log_path = os.path.join(tmpdir, "ssl.log")
            
            # Read ssl.log to get TLS details mapped by connection ID
            ssl_conns = {}
            if os.path.exists(ssl_log_path):
                with open(ssl_log_path, 'r') as f:
                    for line in f:
                        if not line.strip(): continue
                        try:
                            entry = json.loads(line)
                            ssl_conns[entry.get("uid")] = entry
                        except json.JSONDecodeError:
                            continue

            # Read conn.log as base connections (converted to "packets" for the reconstructor)
            if os.path.exists(conn_log_path):
                with open(conn_log_path, 'r') as f:
                    for line in f:
                        if not line.strip(): continue
                        try:
                            entry = json.loads(line)
                            uid = entry.get("uid")
                            protocol = entry.get("proto", "tcp").upper()
                            # orig_bytes + resp_bytes
                            length = entry.get("orig_bytes", 0) + entry.get("resp_bytes", 0)
                            
                            packet_dict = {
                                "src_ip": entry.get("id.orig_h"),
                                "dst_ip": entry.get("id.resp_h"),
                                "src_port": entry.get("id.orig_p"),
                                "dst_port": entry.get("id.resp_p"),
                                "protocol": protocol,
                                "length": length,
                                "has_plaintext_auth": False,
                            }
                            
                            ssl_entry = ssl_conns.get(uid)
                            if ssl_entry:
                                tls_version = ssl_entry.get("version", "Unknown")
                                cipher = ssl_entry.get("cipher", "Unknown")
                                server_name = ssl_entry.get("server_name")
                                
                                if server_name:
                                    packet_dict["hostname"] = server_name
                                    
                                packet_dict["crypto"] = {
                                    "tls_version": tls_version,
                                    "cipher_suite": cipher,
                                    "starttls_used": "TLS" in tls_version or "SSL" in tls_version,
                                    "cert_valid": True, # Requires x509 link parsing for deeper checks
                                    "cert_expired": False,
                                    "self_signed": False,
                                    "hostname_match": True,
                                    "key_size": 2048,
                                    "signature_algorithm": "SHA256WithRSA",
                                    "chain_valid": True,
                                    "handshake_status": "Successful"
                                }
                                
                            raw_packets.append(packet_dict)
                        except json.JSONDecodeError:
                            continue
                            
        return raw_packets

def get_parser(parser_type: str = "mock") -> PcapParserInterface:
    if parser_type == "mock":
        return MockPcapParser()
    elif parser_type == "tshark":
        return TSharkPcapParser()
    elif parser_type == "zeek":
        return ZeekPcapParser()
    else:
        raise ValueError(f"Unknown parser type: {parser_type}")
