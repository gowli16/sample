from typing import Dict, List, Tuple
from app.models.schemas import TrafficType

class ProtocolDetector:
    EMAIL_PORTS = {
        25: "SMTP",
        465: "SMTPS",
        587: "SMTP (Submission)",
        143: "IMAP",
        993: "IMAPS",
        110: "POP3",
        995: "POP3S"
    }

    @staticmethod
    def detect(raw_packets: List[dict]) -> Tuple[TrafficType, Dict[str, int]]:
        protocol_counts = {}
        email_packet_count = 0
        total_packet_count = len(raw_packets)

        for packet in raw_packets:
            src_port = packet.get("src_port")
            dst_port = packet.get("dst_port")
            
            # Determine protocol based on ports
            protocol = "UNKNOWN"
            if dst_port in ProtocolDetector.EMAIL_PORTS:
                protocol = ProtocolDetector.EMAIL_PORTS[dst_port]
                email_packet_count += 1
            elif src_port in ProtocolDetector.EMAIL_PORTS:
                protocol = ProtocolDetector.EMAIL_PORTS[src_port]
                email_packet_count += 1
            else:
                protocol = "OTHER"

            protocol_counts[protocol] = protocol_counts.get(protocol, 0) + 1

        if email_packet_count == 0:
            traffic_type = TrafficType.NON_EMAIL
        elif email_packet_count == total_packet_count:
            traffic_type = TrafficType.EMAIL
        else:
            traffic_type = TrafficType.MIXED

        return traffic_type, protocol_counts
