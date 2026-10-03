import os
import time
import json
from dotenv import load_dotenv
from openai import OpenAI
from shield.config import config

load_dotenv()

def get_client(base_url=None, api_key=None):
    b_url = base_url or config.LLM_BASE_URL
    a_key = api_key or config.LLM_API_KEY or "dummy_key"
    if b_url:
        b_url = b_url.rstrip("/")
        if b_url.endswith("/chat/completions"):
            b_url = b_url[:-17].rstrip("/")
    return OpenAI(base_url=b_url, api_key=a_key, timeout=30)

_client = get_client()
MODEL = config.LLM_MODEL

def chat(messages, temperature=0.0, max_tokens=600, retries=2, model=None):
    """
    Unified chat function to query OpenAI-compatible LLM endpoints.
    Handles automatic retry with exponential backoff on rate limits/network issues.
    """
    client = get_client()
    target_model = model or config.LLM_MODEL
    
    for attempt in range(retries + 1):
        try:
            r = client.chat.completions.create(
                model=target_model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            return r.choices[0].message.content
        except Exception as e:
            if attempt == retries:
                # If primary client fails after retries and backup key exists, attempt backup
                if config.BACKUP_LLM_API_KEY and config.BACKUP_LLM_API_KEY != "your_backup_api_key_here":
                    try:
                        backup_client = get_client(config.BACKUP_LLM_BASE_URL, config.BACKUP_LLM_API_KEY)
                        r = backup_client.chat.completions.create(
                            model=config.BACKUP_LLM_MODEL,
                            messages=messages,
                            temperature=temperature,
                            max_tokens=max_tokens
                        )
                        return r.choices[0].message.content
                    except Exception as backup_err:
                        raise e
                raise e
            time.sleep(1.5 * (attempt + 1))
