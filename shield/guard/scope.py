import re
from typing import List
from shield.models import Scope

EMAIL_REGEX = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")

def extract_scope(user_prompt: str) -> Scope:
    """
    Phase 7: Scope Extractor.
    Extracts strictly what the user authorized, derived ONLY from the trusted user request.
    Never parses untrusted external documents for permissions.
    """
    prompt_lower = user_prompt.lower()
    allowed_tools: List[str] = []
    allowed_paths: List[str] = ["data/quotes/"]
    
    # 1. Tool intent inference
    # File reading is allowed for review/summary/comparison tasks
    if any(w in prompt_lower for w in ["summarize", "review", "compare", "check", "read", "analyze", "pricing", "quote"]):
        allowed_tools.append("read_file")
    
    # Web search
    if any(w in prompt_lower for w in ["search", "web", "lookup", "google", "online", "browse"]):
        allowed_tools.append("search_web")
        
    # Email notification
    if any(w in prompt_lower for w in ["email", "notify", "send", "mail"]):
        allowed_tools.append("send_email")
        
    # Record writing
    if any(w in prompt_lower for w in ["save", "record", "store", "log", "insert", "write"]):
        allowed_tools.append("write_record")

    # If no specific action words matched, provide safe default read_file
    if not allowed_tools:
        allowed_tools = ["read_file"]

    # 2. Extract allowed email recipients literally stated in user prompt
    raw_emails = EMAIL_REGEX.findall(user_prompt)
    allowed_recipients = [e.rstrip(".,;:") for e in raw_emails]

    # 3. Specific document paths mentioned
    file_matches = re.findall(r"[\w-]+\.(?:txt|pdf|md|json|csv)", user_prompt)
    for fname in file_matches:
        if not any(c in fname.lower() for c in ["confidential", "aws", "salary", "api_key"]):
            allowed_paths.append(fname)
            allowed_paths.append(f"data/quotes/{fname}")

    # Generate concise summary
    summary = user_prompt.strip()
    if len(summary) > 80:
        summary = summary[:77] + "..."

    return Scope(
        allowed_tools=list(set(allowed_tools)),
        allowed_paths=list(set(allowed_paths)),
        allowed_recipients=allowed_recipients,
        summary=summary
    )
