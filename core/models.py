from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Any
import time
import uuid

class AttackCategory(str, Enum):
    PLAIN = "Plain Instruction Injection"
    ENCODED = "Encoded Payload (Base64/Hex/Zero-Width)"
    FAKE_SYSTEM = "Fake System Message / Persona Hijack"
    TOOL_INJECTION = "Tool-Response Injection"
    MULTI_STEP = "Multi-Step Exfiltration"
    BENIGN = "Benign Legitimate Task"

class DefenseDecision(str, Enum):
    ALLOW = "ALLOW"
    BLOCK = "BLOCK"
    ASK_HUMAN = "ASK_HUMAN"

@dataclass
class ToolCall:
    tool_name: str
    arguments: Dict[str, Any]
    status: str = "proposed"  # proposed, executed, blocked, pending_approval
    result: Optional[str] = None

@dataclass
class ContentFirewallResult:
    is_flagged: bool
    risk_level: str  # LOW, MEDIUM, CRITICAL
    detected_signals: List[str] = field(default_factory=list)
    decoded_payload: Optional[str] = None
    classifier_label: str = "benign_data"  # benign_data, indirect_injection, command_override
    sanitized_content: str = ""
    latency_ms: float = 0.0
    threat_score: int = 0
    threat_severity: str = "LOW"
    threat_breakdown: List[Dict[str, Any]] = field(default_factory=list)

@dataclass
class ActionGuardResult:
    decision: DefenseDecision
    authorized_scope: Dict[str, Any] = field(default_factory=dict)
    rule_violated: Optional[str] = None
    reason: str = ""
    evidence_snippet: str = ""
    latency_ms: float = 0.0

@dataclass
class AgentExecutionTrace:
    agent_id: str
    agent_name: str
    status: str  # EXPLOITED, BLOCKED, COMPLETED, WAITING_APPROVAL
    input_prompt: str
    untrusted_document_name: str
    untrusted_content: str
    firewall_result: Optional[ContentFirewallResult] = None
    guard_result: Optional[ActionGuardResult] = None
    thoughts: List[str] = field(default_factory=list)
    tool_calls: List[ToolCall] = field(default_factory=list)
    final_output: str = ""
    total_latency_ms: float = 0.0

@dataclass
class Scenario:
    id: str
    title: str
    category: AttackCategory
    user_prompt: str
    document_name: str
    document_content: str
    injection_payload: str
    expected_exploit_action: str
    attack_description: str
    is_unseen_split: bool = False
