from pydantic import BaseModel, Field
from typing import Literal, Optional, List, Dict, Any

class Scope(BaseModel):
    """What the USER allowed. Built only from the user's own request."""
    allowed_tools: List[str] = Field(default_factory=list)      # e.g. ["read_file", "write_record"]
    allowed_paths: List[str] = Field(default_factory=list)      # e.g. ["data/quotes/"]
    allowed_recipients: List[str] = Field(default_factory=list) # emails the user literally wrote
    summary: str = ""                                           # one-line intent of the task

class ToolCall(BaseModel):
    tool: str                                                   # e.g. "send_email"
    args: Dict[str, Any] = Field(default_factory=dict)          # e.g. {"to": "...", "subject": "...", "body": "..."}

class Decision(BaseModel):
    verdict: Literal["ALLOW", "BLOCK", "ASK_HUMAN"]
    rule: str                                                   # machine name, e.g. "recipient_not_in_scope"
    reason: str                                                 # sentence a human can read
    evidence: str = ""                                          # the snippet that triggered it

class FirewallResult(BaseModel):
    status: Literal["CLEAN", "SANITISED", "QUARANTINED"]
    safe_text: str                                              # what the agent is allowed to see
    findings: List[Dict[str, Any]] = Field(default_factory=list)# each: {layer, rule, snippet, score}
    latency_ms: float = 0.0

class AuditEvent(BaseModel):
    ts: str
    run_id: str
    layer: Literal["firewall", "scope", "action_guard"]
    decision: str
    rule: str
    reason: str
    evidence: str = ""                                          # keep short (max about 200 chars)
    tool_call: Optional[Dict[str, Any]] = None
    latency_ms: float = 0.0
