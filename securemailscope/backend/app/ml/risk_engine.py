"""
SecureMailScope — ML Risk Engine.

Combines RandomForest predictions with deterministic feature
contribution analysis to produce explainable risk assessments.

Architecture note:
  The explainability layer currently uses a rule-based heuristic
  that maps feature values to human-readable descriptions.  This
  is structured so SHAP (SHapley Additive exPlanations) can later
  replace the heuristic by calling:

      import shap
      explainer = shap.TreeExplainer(model)
      shap_values = explainer.shap_values(feature_vector)

  The FeatureContribution model is compatible with both approaches.
"""

from typing import List
from app.models.schemas import RiskAssessment, RiskLevel, FeatureContribution
from app.ml.predictor import Predictor
from app.ml.model import ModelManager
from app.analysis.feature_extractor import FeatureExtractor


# ── Feature interpretation rules ──────────────────────────────────────────
# Maps (feature_name, bad_condition) → human-readable description + base weight

_FEATURE_RULES = {
    "tls_version_encoded": [
        (lambda v: v == 0, "No TLS encryption", 35),
        (lambda v: v == 1, "TLS 1.0 detected (deprecated, known vulnerabilities)", 30),
        (lambda v: v == 2, "TLS 1.1 detected (deprecated)", 20),
    ],
    "cipher_strength": [
        (lambda v: v == 0, "No cipher suite negotiated", 25),
        (lambda v: v == 1, "Weak cipher suite (RC4/DES/3DES)", 20),
    ],
    "plaintext_auth": [
        (lambda v: v > 0.5, "Plaintext authentication credentials exposed", 30),
    ],
    "cert_valid": [
        (lambda v: v < 0.5, "Invalid TLS certificate", 20),
    ],
    "cert_expired": [
        (lambda v: v > 0.5, "Expired TLS certificate", 25),
    ],
    "cert_self_signed": [
        (lambda v: v > 0.5, "Self-signed certificate (not CA-issued)", 18),
    ],
    "hostname_match": [
        (lambda v: v < 0.5, "Certificate hostname mismatch", 15),
    ],
    "chain_valid": [
        (lambda v: v < 0.5, "Incomplete certificate chain", 12),
    ],
    "key_size_normalized": [
        (lambda v: 0 < v < 0.75, "Weak RSA key size (< 2048 bits)", 15),
        (lambda v: v == 0, "No certificate key", 10),
    ],
    "sig_algo_strength": [
        (lambda v: v == 1, "Weak signature algorithm (SHA-1/MD5)", 12),
        (lambda v: v == 0, "No signature algorithm", 8),
    ],
    "starttls_offered": [
        (lambda v: v < 0.5, "STARTTLS not available", 15),
    ],
    "handshake_success": [
        (lambda v: v < 0.5, "TLS handshake failed or not attempted", 20),
    ],
    "downgrade_indicator": [
        (lambda v: v > 0.5, "Potential TLS downgrade detected", 10),
    ],
}


class RiskEngine:
    """Produce explainable risk assessments from feature vectors."""

    def __init__(self):
        self.predictor = Predictor()
        self.model_manager = ModelManager.get_instance()

    def assess_risk(self, feature_vector: list) -> RiskAssessment:
        # ── ML prediction ─────────────────────────────────────────────
        pred_class, score, probs = self.predictor.predict_risk(feature_vector)

        levels = [RiskLevel.LOW, RiskLevel.MEDIUM, RiskLevel.HIGH, RiskLevel.CRITICAL]
        level = levels[pred_class]
        confidence = float(max(probs))

        # ── Explainability: rule-based feature contributions ──────────
        # (Future: replace with SHAP values from self.model_manager._model)
        importances = self.model_manager.get_feature_importances()
        contributions: List[FeatureContribution] = []

        for i, (name, val) in enumerate(
            zip(FeatureExtractor.FEATURE_NAMES, feature_vector)
        ):
            rules = _FEATURE_RULES.get(name, [])
            for condition, description, base_weight in rules:
                try:
                    if condition(val):
                        # Scale by ML feature importance for realism
                        importance = importances[i] if i < len(importances) else 0.1
                        contribution = round(base_weight * (0.5 + importance * 5), 1)
                        contributions.append(FeatureContribution(
                            feature=name,
                            contribution=contribution,
                            description=description,
                        ))
                        break  # Only first matching rule per feature
                except Exception:
                    pass

        # Sort by contribution descending
        contributions.sort(key=lambda c: c.contribution, reverse=True)

        # Top factors (human-readable strings for the dashboard)
        top_factors = [c.description for c in contributions[:5]]
        if not top_factors and score > 20:
            top_factors = ["General deviation from secure email best practices"]

        return RiskAssessment(
            score=score,
            level=level,
            confidence=round(confidence, 2),
            top_factors=top_factors,
            feature_contributions=contributions,
        )
