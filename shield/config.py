import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    LLM_BASE_URL: str = os.environ.get("LLM_BASE_URL", "https://api.groq.com/openai/v1")
    LLM_API_KEY: str = os.environ.get("LLM_API_KEY", "")
    LLM_MODEL: str = os.environ.get("LLM_MODEL", "llama-3.3-70b-versatile")
    
    BACKUP_LLM_BASE_URL: str = os.environ.get("BACKUP_LLM_BASE_URL", "https://api.together.xyz/v1")
    BACKUP_LLM_API_KEY: str = os.environ.get("BACKUP_LLM_API_KEY", "")
    BACKUP_LLM_MODEL: str = os.environ.get("BACKUP_LLM_MODEL", "meta-llama/Llama-3.3-70B-Instruct-Turbo")

config = Config()
