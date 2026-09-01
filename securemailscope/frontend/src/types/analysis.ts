/**
 * SecureMailScope — TypeScript interfaces.
 *
 * These mirror the Pydantic models in the backend exactly
 * so JSON responses deserialise without transformation.
 */

// ── Enums / unions ───────────────────────────────────────────────────────

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type TrafficType = 'EMAIL' | 'NON_EMAIL' | 'MIXED' | 'UNKNOWN';
export type AnalysisStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'NOT_APPLICABLE';

// ── Crypto / TLS ─────────────────────────────────────────────────────────

export interface TLSSummary {
  version: string;
  cipher_suite: string;
  starttls_used: boolean;
  is_secure: boolean;
}

export interface CryptoDetails {
  tls_version: string;
  cipher_suite: string;
  starttls_used: boolean;
  cert_valid: boolean;
  cert_expired: boolean;
  self_signed: boolean;
  hostname_match: boolean;
  key_size: number;
  signature_algorithm: string;
  chain_valid: boolean;
  handshake_status: string;
  cert_expiry_date: string | null;
  cert_issuer: string | null;
  sni_hostname: string | null;
}

// ── Findings ─────────────────────────────────────────────────────────────

export interface Finding {
  severity: SeverityLevel;
  title: string;
  description: string;
  evidence: string;
  impact: string;
  recommendation: string;
}

// ── Sessions ─────────────────────────────────────────────────────────────

export interface SessionInfo {
  id: string;
  src_ip: string;
  dst_ip: string;
  dst_port: number;
  protocol: string;
  bytes_transferred: number;
  duration_ms: number;
  crypto_details: CryptoDetails | null;
  tls_summary: TLSSummary | null;
  has_plaintext_auth: boolean;
  hostname: string | null;
  risk_score: number | null;
  risk_level: string | null;
  session_findings: Finding[] | null;
}

// ── Risk / Explainability ────────────────────────────────────────────────

export interface FeatureContribution {
  feature: string;
  contribution: number;
  description: string;
}

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  confidence: number;
  top_factors: string[];
  feature_contributions: FeatureContribution[];
}

// ── TLS Version Counts ───────────────────────────────────────────────────

export interface TLSVersionCounts {
  tls_1_3: number;
  tls_1_2: number;
  tls_1_1: number;
  tls_1_0: number;
  ssl: number;
  unencrypted: number;
}

// ── Analysis Result (the big one) ────────────────────────────────────────

export interface AnalysisResult {
  id: string;
  status: AnalysisStatus;
  traffic_type: TrafficType;
  protocol_counts: Record<string, number>;
  tls_version_counts: TLSVersionCounts | null;
  sessions: SessionInfo[];
  findings: Finding[];
  risk_assessment: RiskAssessment | null;
  error_message: string | null;
  detected_traffic_types: string[] | null;
  recommendations: string[] | null;
  total_sessions: number;
  encrypted_sessions: number;
  unencrypted_sessions: number;
  analysis_timestamp: string | null;
}

// ── API Responses ────────────────────────────────────────────────────────

export interface AnalysisResponse {
  id: string;
  status: AnalysisStatus;
  message: string;
}

export interface ScenarioInfo {
  name: string;
  description: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  ml_model_status: string;
}
