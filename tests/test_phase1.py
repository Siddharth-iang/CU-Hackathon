import pytest
from shield.models import Scope, ToolCall, Decision, FirewallResult, AuditEvent
from shield.config import config
from shield.firewall.decoder import views, printable_ratio

def test_models_instantiation():
    scope = Scope(
        allowed_tools=["read_file", "write_record"],
        allowed_paths=["quotes/"],
        allowed_recipients=["finance@company.com"],
        summary="Compare quotes"
    )
    assert scope.allowed_tools == ["read_file", "write_record"]
    assert scope.summary == "Compare quotes"

    tool_call = ToolCall(tool="send_email", args={"to": "user@test.com"})
    assert tool_call.tool == "send_email"

    decision = Decision(verdict="ALLOW", rule="within_scope", reason="Inside scope", evidence="")
    assert decision.verdict == "ALLOW"

    firewall = FirewallResult(status="CLEAN", safe_text="Safe content", findings=[], latency_ms=1.5)
    assert firewall.status == "CLEAN"

    audit = AuditEvent(
        ts="2026-10-03T12:00:00Z",
        run_id="run_1",
        layer="action_guard",
        decision="ALLOW",
        rule="within_scope",
        reason="OK",
        evidence=""
    )
    assert audit.run_id == "run_1"

def test_decoder_views():
    raw_text = "Hello world!"
    v = views(raw_text)
    assert len(v) >= 1
    assert "Hello world!" in v[0]

def test_config():
    assert config.LLM_MODEL is not None
