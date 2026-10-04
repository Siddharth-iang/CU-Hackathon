import os
from dotenv import load_dotenv

load_dotenv()

def get_secret(key: str, default: str = "") -> str:
    """Retrieve environment secret with fallback to Streamlit secrets if present."""
    val = os.environ.get(key, "")
    if not val:
        try:
            import streamlit as st
            if hasattr(st, "secrets") and key in st.secrets:
                val = str(st.secrets[key])
        except Exception:
            pass
    return val or default

class Config:
    LLM_BASE_URL: str = get_secret("LLM_BASE_URL", "https://api.groq.com/openai/v1")
    LLM_API_KEY: str = get_secret("LLM_API_KEY", "")
    LLM_MODEL: str = get_secret("LLM_MODEL", "llama-3.3-70b-versatile")
    
    BACKUP_LLM_BASE_URL: str = get_secret("BACKUP_LLM_BASE_URL", "https://api.together.xyz/v1")
    BACKUP_LLM_API_KEY: str = get_secret("BACKUP_LLM_API_KEY", "")
    BACKUP_LLM_MODEL: str = get_secret("BACKUP_LLM_MODEL", "meta-llama/Llama-3.3-70B-Instruct-Turbo")

    ELEVENLABS_API_KEY: str = get_secret("ELEVENLABS_API_KEY", "")
    ELEVENLABS_VOICE_ID: str = get_secret("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")

    def __getattr__(self, name: str) -> str:
        # Graceful fallback to avoid AttributeError on any dynamic key
        return get_secret(name, "")

config = Config()
ELEVENLABS_API_KEY = config.ELEVENLABS_API_KEY
ELEVENLABS_VOICE_ID = config.ELEVENLABS_VOICE_ID
