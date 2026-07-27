"""
CipherPulse — Application Configuration
"""

import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".env"))


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://cipherpulse:cipherpulse_secret@localhost:5432/cipherpulse"
    MODEL_VERSION: str = "v1-tfidf-lr"
    RISK_THRESHOLD: int = 60
    USE_TEE: bool = False  # Enable to route inference through AWS Nitro Enclave
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000", "http://localhost:8050"]
    
    # Stripe Integrations
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET_SNAPSHOT: str = ""
    STRIPE_WEBHOOK_SECRET_THIN: str = ""

    model_config = {
        "extra": "ignore",
        "env_file": ".env"
    }


settings = Settings()

