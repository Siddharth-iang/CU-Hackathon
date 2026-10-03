import os
import sys
import datetime
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Ensure project root is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from shield.service import run_task, list_attacks
from shield.audit import AuditLogger
from eval.runner import run_evaluation

app = FastAPI(
    title="SENTINEL // PromptShield Security API",
    description="Dual-Layer Input Content Firewall and Output Action Guard for LLM Agents",
    version="1.0.0"
)

# Enable CORS for local dashboards / frontend apps
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = AuditLogger()

# Request & Response schemas
class RunRequest(BaseModel):
    item_id: Optional[str] = None
    user_prompt: Optional[str] = None
    document_content: Optional[str] = None
    document_name: Optional[str] = None
    mode: str = "protected"  # "baseline" or "protected"

class ConfirmRequest(BaseModel):
    run_id: str
    action: str  # "APPROVE" or "REJECT"
    reviewer: Optional[str] = "security_officer"
    note: Optional[str] = ""

class EvalRequest(BaseModel):
    split: Optional[str] = "all"  # "all", "dev", "unseen", "attacks", "benign"
    limit: Optional[int] = None

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "SENTINEL // PromptShield Agent Defense Engine",
        "version": "1.0.0",
        "layers": {
            "layer_1": "Input-Side Content Firewall (Decoding + Heuristics + Spotlight)",
            "layer_2": "Output-Side Action Guard (Scope Derivation + Pre-flight Gate)",
            "layer_3": "Audit Ledger (JSONL + SQLite)"
        }
    }

@app.get("/attacks")
def get_attacks():
    """Retrieve catalog of 48 benchmark attacks and benign tasks."""
    return list_attacks()

@app.post("/run")
def execute_run(req: RunRequest):
    """Execute a single scenario or custom task in baseline or protected mode."""
    try:
        result = run_task(
            item_id=req.item_id,
            mode=req.mode,
            user_prompt=req.user_prompt,
            document_content=req.document_content,
            document_name=req.document_name
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/audit")
def get_audit_trail(limit: int = Query(default=50, ge=1, le=200)):
    """Fetch recent audit events from ledger."""
    return logger.get_recent_events(limit=limit)

@app.post("/confirm")
def confirm_action(req: ConfirmRequest):
    """
    Supervisor confirmation endpoint for tasks paused in WAITING_APPROVAL status.
    Records operator sign-off into audit ledger.
    """
    verdict = "HUMAN_APPROVED" if req.action.upper() == "APPROVE" else "HUMAN_REJECTED"
    from shield.models import AuditEvent
    
    event = AuditEvent(
        ts=datetime.datetime.now(datetime.timezone.utc).isoformat(),
        run_id=req.run_id,
        layer="action_guard",
        decision=verdict,
        rule="human_in_the_loop_confirmation",
        reason=f"Operator '{req.reviewer}' marked action as {verdict}. Note: {req.note}",
        evidence=req.run_id,
        latency_ms=0.0
    )
    logger.log_event(event)
    return {
        "status": "recorded",
        "run_id": req.run_id,
        "decision": verdict,
        "timestamp": event.ts
    }

@app.post("/eval")
def trigger_evaluation(req: EvalRequest):
    """Run automated batch evaluation across scenarios and return benchmark metrics."""
    try:
        return run_evaluation(split=req.split or "all", limit=req.limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
