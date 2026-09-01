"""
SecureMailScope — Pydantic data models.

All API responses and internal data structures are defined here.
These models mirror the TypeScript interfaces on the frontend.
"""

from enum import Enum
from typing import List, Optional, Dict
from pydantic import BaseModel, Field


# ── Enums ────────────────────────────────────────────────────────────────────

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class Severity(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INFO = "INFO"


class TrafficType(str, Enum):
    EMAIL = "EMAIL"
    NON_EMAIL = "NON_EMAIL"
    MIXED = "MIXED"
    UNKNOWN = "UNKNOWN"


class AnalysisStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    NOT_APPLICABLE = "NOT_APPLICABLE"


# ── TLS / Crypto ─────────────────────────────────────────────────────────────

class TLSSummary(BaseModel):
    version: str
    cipher_suite: str
    starttls_used: bool
    is_secure: bool


class CryptoDetails(BaseModel):
    tls_version: str
    cipher_suite: str
    starttls_used: bool = False
    cert_valid: bool
    cert_expired: bool
    self_signed: bool
    hostname_match: bool
    key_size: int
    signature_algorithm: str
    chain_valid: bool
    handshake_status: str = "Successful"
    cert_expiry_date: Optional[str] = None   # e.g. "2024-03-15"
    cert_issuer: Optional[str] = None        # e.g. "Let's Encrypt Authority X3"
    sni_hostname: Optional[str] = None       # e.g. "mail.example.com"


# ── Findings ─────────────────────────────────────────────────────────────────

class Finding(BaseModel):
    severity: Severity
    title: str
    description: str
    evidence: str = ""
    impact: str = ""
    recommendation: str = ""


# ── Sessions ─────────────────────────────────────────────────────────────────

class SessionInfo(BaseModel):
    id: str
    src_ip: str
    dst_ip: str
    dst_port: int
    protocol: str
    bytes_transferred: int
    duration_ms: int
    crypto_details: Optional[CryptoDetails] = None
    tls_summary: Optional[TLSSummary] = None
    has_plaintext_auth: bool = False
    hostname: Optional[str] = None          # e.g. "mail.example.com"
    risk_score: Optional[int] = None        # per-session ML risk
    risk_level: Optional[str] = None
    session_findings: Optional[List[Finding]] = None


# ── Risk / Explainability ────────────────────────────────────────────────────

class FeatureContribution(BaseModel):
    feature: str
    contribution: float
    description: str


class RiskAssessment(BaseModel):
    score: int = Field(ge=0, le=100)
    level: RiskLevel
    confidence: float = Field(ge=0.0, le=1.0)
    top_factors: List[str]
    feature_contributions: List[FeatureContribution]


# ── TLS Version Distribution ─────────────────────────────────────────────────

class TLSVersionCounts(BaseModel):
    tls_1_3: int = 0
    tls_1_2: int = 0
    tls_1_1: int = 0
    tls_1_0: int = 0
    ssl: int = 0
    unencrypted: int = 0


# ── Overall Analysis Result ──────────────────────────────────────────────────

class AnalysisResult(BaseModel):
    id: str
    status: AnalysisStatus
    traffic_type: TrafficType
    protocol_counts: Dict[str, int]
    tls_version_counts: Optional[TLSVersionCounts] = None
    sessions: List[SessionInfo]
    findings: List[Finding]
    risk_assessment: Optional[RiskAssessment] = None
    error_message: Optional[str] = None
    detected_traffic_types: Optional[List[str]] = None     # for NOT_APPLICABLE
    recommendations: Optional[List[str]] = None
    total_sessions: int = 0
    encrypted_sessions: int = 0
    unencrypted_sessions: int = 0
    analysis_timestamp: Optional[str] = None


# ── API Response Wrappers ────────────────────────────────────────────────────

class AnalysisResponse(BaseModel):
    id: str
    status: AnalysisStatus
    message: str


class HealthResponse(BaseModel):
    status: str
    version: str
    ml_model_status: str = "ready"
