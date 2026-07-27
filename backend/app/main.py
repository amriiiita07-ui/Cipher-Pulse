"""
CipherPulse — FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.core.config import settings
from backend.app.api.routes_analyze import router as analyze_router
from backend.app.api.routes_messages import router as messages_router
from backend.app.api.routes_feedback import router as feedback_router
from backend.app.api.routes_billing import router as billing_router

app = FastAPI(
    title="CipherPulse — Confidential Compliance AI",
    description="AI-powered communications surveillance for financial compliance",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(analyze_router)
app.include_router(messages_router)
app.include_router(feedback_router)
app.include_router(billing_router)


@app.get("/")
def health():
    return {
        "status": "online",
        "service": "CipherPulse API",
        "version": "1.0.0",
        "model_version": settings.MODEL_VERSION,
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
