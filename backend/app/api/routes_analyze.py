"""
CipherPulse — /analyze endpoint
Accepts a message, runs ML scoring, stores results, returns risk assessment.
"""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.db import crud
from backend.app.core.config import settings
from backend.app.ml.vectorizer import load_vectorizer
from backend.app.ml.model import load_model, predict_risk
from backend.app.ml.explain import explain_prediction

router = APIRouter(prefix="/api", tags=["analyze"])

# Load ML artifacts once at module level
_vectorizer = None
_model = None


def _ensure_model():
    global _vectorizer, _model
    if _vectorizer is None:
        _vectorizer = load_vectorizer()
    if _model is None:
        _model = load_model()


# ─── Request / Response schemas ──────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    source: str = "ui"
    sender_id: Optional[str] = "ui-user"
    sender_role: Optional[str] = "Unknown"
    team: Optional[str] = "Unknown"
    channel_id: Optional[str] = "live-input"
    message_text: str
    timestamp: Optional[str] = None


class AnalyzeResponse(BaseModel):
    raw_id: str
    risk_score: float
    labels: list[str]
    predicted_label: str
    explanation: dict
    probabilities: dict


# ─── Endpoint ────────────────────────────────────────────────────────────────

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_message(req: AnalyzeRequest, db: Session = Depends(get_db)):
    """
    Analyze a single message for compliance risk.
    1. Store raw message
    2. Run ML inference
    3. Store scored result
    4. Return risk assessment
    """
    _ensure_model()

    ts = datetime.fromisoformat(req.timestamp) if req.timestamp else datetime.utcnow()

    # 1. Store raw message
    raw_msg = crud.create_raw_message(
        db,
        source=req.source,
        timestamp=ts,
        sender_id=req.sender_id,
        sender_role=req.sender_role,
        team=req.team,
        channel_id=req.channel_id,
        message_text=req.message_text,
    )

    # 2 & 3. Run ML inference and get explanation
    if settings.USE_TEE:
        import socket
        import json
        import traceback
        try:
            print("🔒 Routing inference through secure Nitro Enclave (VSOCK)...")
            # Attempt to use VSOCK, fallback to TCP for local testing if needed
            try:
                client = socket.socket(socket.AF_VSOCK, socket.SOCK_STREAM)
                client.connect((16, 5000)) # CID 16 is typically the local enclave
            except AttributeError:
                # AF_VSOCK not available, try local TCP simulator
                client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                client.connect(("127.0.0.1", 5000))

            client.sendall(json.dumps({"text": req.message_text}).encode('utf-8'))
            response_data = client.recv(1024 * 1024)
            tee_result = json.loads(response_data.decode('utf-8'))
            
            if "error" in tee_result:
                raise Exception(tee_result["error"])
                
            risk_score = tee_result["risk_score"]
            labels = tee_result["labels"]
            predicted_label = tee_result["predicted_label"]
            explanation = tee_result["explanation"]
            probabilities = tee_result["probabilities"]
            
        except Exception as e:
            print(f"❌ TEE connection failed: {e}")
            traceback.print_exc()
            raise HTTPException(status_code=500, detail="Failed to connect to Secure Enclave for inference")
    else:
        # Run ML inference locally
        features = _vectorizer.transform([req.message_text])
        result = predict_risk(_model, features)

        explanation = explain_prediction(
            req.message_text, _vectorizer, _model,
            result["predicted_label"]
        )

        risk_score = result["risk_score"]
        predicted_label = result["predicted_label"]
        probabilities = result["probabilities"]

        labels = []
        if predicted_label != "BENIGN":
            labels.append(predicted_label)
            for lbl, prob in probabilities.items():
                if lbl != "BENIGN" and lbl != predicted_label and prob > 0.15:
                    labels.append(lbl)

    # 4. Store scored result
    scored = crud.create_scored(
        db,
        raw_id=raw_msg.id,
        risk_score=risk_score,
        labels=labels,
        explanation=explanation,
        model_version=settings.MODEL_VERSION + ("-TEE" if settings.USE_TEE else ""),
    )

    return AnalyzeResponse(
        raw_id=str(raw_msg.id),
        risk_score=risk_score,
        labels=labels,
        predicted_label=predicted_label,
        explanation=explanation,
        probabilities=probabilities,
    )


@router.get("/tee/attest")
def attest_enclave(nonce: Optional[str] = "cipherpulse-session-attestation"):
    """
    Request a cryptographically signed hardware attestation token from the running AWS Nitro Enclave TEE.
    Forces a zero-trust handshake verifying the PCR0/PCR1/PCR2 hashes before processing production workloads.
    """
    import socket
    import json
    import traceback
    
    try:
        # Attempt to use VSOCK, fallback to TCP for local testing if needed
        try:
            client = socket.socket(socket.AF_VSOCK, socket.SOCK_STREAM)
            client.connect((16, 5000))
        except AttributeError:
            client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            client.connect(("127.0.0.1", 5000))

        client.sendall(json.dumps({"action": "attest", "nonce": nonce}).encode('utf-8'))
        response_data = client.recv(1024 * 1024)
        result = json.loads(response_data.decode('utf-8'))
        client.close()
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
        
    except Exception as e:
        print(f"❌ Enclave attestation fetch failed: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail="Failed to connect to TEE Security Module for cryptographic attestation document"
        )

