"""
SecureMailScope — API Routes.

Endpoints:
  POST /api/analyze              — Upload PCAP file, start analysis
  GET  /api/analyze/{id}         — Get analysis status + results
  GET  /api/report/{id}          — Get HTML security report
  GET  /api/health               — Health check
  GET  /api/scenarios            — List available demo scenarios
  POST /api/analyze/scenario/{n} — Run a demo scenario
"""

import uuid
import os
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse
from typing import Dict, List

from app.models.schemas import AnalysisResponse, AnalysisStatus, HealthResponse
from app.services.analysis_service import AnalysisService
from app.reports.report_generator import ReportGenerator
from app.ml.model import ModelManager
from data.sample_scenarios import SCENARIOS

router = APIRouter()
analysis_service = AnalysisService()


# ── Health Check ──────────────────────────────────────────────────────────

@router.get("/health", response_model=HealthResponse)
async def health_check():
    mm = ModelManager.get_instance()
    return HealthResponse(
        status="ok",
        version="1.0.0",
        ml_model_status="ready" if mm.is_trained else "not_trained",
    )


# ── PCAP File Upload & Analysis ───────────────────────────────────────────

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_pcap(file: UploadFile = File(...)):
    """Accept a PCAP/PCAPNG file, validate it, and start analysis."""
    filename = file.filename or ""
    if not filename.lower().endswith((".pcap", ".pcapng")):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only .pcap and .pcapng files are accepted.",
        )

    analysis_id = str(uuid.uuid4())

    # Save uploaded file to a temp location
    suffix = ".pcapng" if filename.lower().endswith(".pcapng") else ".pcap"
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        content = await file.read()
        tmp.write(content)
        tmp.close()
    except Exception as e:
        tmp.close()
        os.unlink(tmp.name)
        raise HTTPException(status_code=500, detail=f"Failed to save file: {e}")

    await analysis_service.start_analysis(analysis_id, tmp.name)

    return AnalysisResponse(
        id=analysis_id,
        status=AnalysisStatus.PENDING,
        message=f"Analysis started for '{filename}'",
    )


# ── Get Analysis Result ───────────────────────────────────────────────────

@router.get("/analyze/{analysis_id}")
async def get_analysis_result(analysis_id: str):
    """Return current analysis status and results."""
    result = analysis_service.get_result(analysis_id)
    if not result:
        raise HTTPException(status_code=404, detail="Analysis ID not found")
    return result


# ── Generate Report ───────────────────────────────────────────────────────

@router.get("/report/{analysis_id}", response_class=HTMLResponse)
async def get_report(analysis_id: str):
    """Generate and return an HTML security report."""
    result = analysis_service.get_result(analysis_id)
    if not result:
        raise HTTPException(status_code=404, detail="Analysis ID not found")

    if result.status not in (AnalysisStatus.COMPLETED, AnalysisStatus.NOT_APPLICABLE):
        raise HTTPException(
            status_code=400,
            detail=f"Analysis is not complete (status: {result.status.value})",
        )

    report_html = ReportGenerator.generate(result)
    return HTMLResponse(content=report_html)


# ── Demo Scenarios ────────────────────────────────────────────────────────

@router.get("/scenarios")
async def list_scenarios() -> List[Dict[str, str]]:
    """List available demo scenarios with descriptions."""
    descriptions = {
        "secure_smtp": "Secure SMTP with TLS 1.3, strong ciphers, valid certificates. Expected: LOW risk.",
        "legacy_tls": "Legacy TLS 1.0/1.1 with weak ciphers (RC4, 3DES). Expected: HIGH/CRITICAL risk.",
        "certificate_problem": "TLS 1.2 with expired, self-signed certificates and hostname mismatch. Expected: HIGH risk.",
        "plaintext_email": "SMTP/POP3/IMAP with no TLS and plaintext authentication. Expected: CRITICAL risk.",
        "unsupported_pcap": "802.11, DNS, HTTP traffic only — no email protocols. Expected: NOT APPLICABLE.",
    }
    return [
        {"name": name, "description": descriptions.get(name, name)}
        for name in SCENARIOS.keys()
    ]


@router.post("/analyze/scenario/{name}", response_model=AnalysisResponse)
async def analyze_scenario(name: str):
    """Run analysis on a built-in demo scenario."""
    if name not in SCENARIOS:
        available = ", ".join(SCENARIOS.keys())
        raise HTTPException(
            status_code=404,
            detail=f"Scenario '{name}' not found. Available: {available}",
        )

    analysis_id = str(uuid.uuid4())

    # Create a temp PCAP with valid magic bytes and size
    # corresponding to the scenario's heuristic bucket.
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pcap")

    # Write PCAP magic bytes (little-endian)
    tmp.write(b"\xd4\xc3\xb2\xa1")

    # Pad to the right file-size bucket for MockPcapParser heuristics:
    #   < 1024  → unsupported_pcap
    #   < 2048  → plaintext_email
    #   < 3072  → certificate_problem
    #   < 4096  → legacy_tls
    #   ≥ 4096  → secure_smtp
    size_map = {
        "unsupported_pcap": 500,
        "plaintext_email": 1500,
        "certificate_problem": 2500,
        "legacy_tls": 3500,
        "secure_smtp": 4500,
    }
    pad = size_map.get(name, 4500)
    tmp.write(b"\x00" * pad)
    tmp.close()

    await analysis_service.start_analysis(analysis_id, tmp.name)

    return AnalysisResponse(
        id=analysis_id,
        status=AnalysisStatus.PENDING,
        message=f"Demo scenario '{name}' analysis started",
    )
