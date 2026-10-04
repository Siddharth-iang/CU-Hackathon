"""
Tests for Sentinel ElevenLabs Voice & Audio Engine.
"""
from core.audio import (
    build_incident_alert_text,
    build_ciso_briefing_text,
    get_audio_cache_key,
    _AUDIO_CACHE,
    VOICE_PROFILES,
    DEFAULT_VOICE_ID,
    synthesize_speech
)
from core.models import (
    Scenario,
    AttackCategory,
    AgentExecutionTrace,
    ContentFirewallResult,
    ActionGuardResult,
    DefenseDecision
)

def test_script_builders():
    sc = Scenario(
        id="test_01",
        title="Test Infiltration",
        category=AttackCategory.PLAIN,
        user_prompt="Review file",
        document_name="secret_invoice.pdf",
        document_content="Malicious payload",
        injection_payload="exfiltrate data",
        expected_exploit_action="send_email",
        attack_description="Attack test"
    )

    fw = ContentFirewallResult(
        is_flagged=True,
        risk_level="CRITICAL",
        threat_score=92,
        threat_severity="CRITICAL",
        detected_signals=["jailbreak"],
        sanitized_content="Spotlighted",
        latency_ms=12.5
    )

    guard = ActionGuardResult(
        decision=DefenseDecision.BLOCK,
        rule_violated="RECIPIENT_SCOPE_VIOLATION",
        reason="Recipient not allowlisted",
        latency_ms=8.2
    )

    prot = AgentExecutionTrace(
        agent_id="ag-01",
        agent_name="Protected Agent",
        status="BLOCKED",
        input_prompt="Review file",
        untrusted_document_name="secret_invoice.pdf",
        untrusted_content="Malicious payload",
        firewall_result=fw,
        guard_result=guard,
        total_latency_ms=20.7
    )

    unprot = AgentExecutionTrace(
        agent_id="ag-00",
        agent_name="Unprotected Agent",
        status="EXPLOITED",
        input_prompt="Review file",
        untrusted_document_name="secret_invoice.pdf",
        untrusted_content="Malicious payload",
        total_latency_ms=15.0
    )

    # 1. Alert script check
    alert_txt = build_incident_alert_text(sc, prot)
    assert "Security Alert" in alert_txt
    assert "secret_invoice.pdf" in alert_txt
    assert "92" in alert_txt
    assert "Zero bytes leaked" in alert_txt

    # 2. CISO briefing check
    ciso_txt = build_ciso_briefing_text(sc, prot, unprot)
    assert "Sentinel CISO Incident Debrief" in ciso_txt
    assert "SOC2 Type-II" in ciso_txt
    assert "secret_invoice.pdf" in ciso_txt

    # 3. Cache key determinism
    k1 = get_audio_cache_key("test alert", DEFAULT_VOICE_ID)
    k2 = get_audio_cache_key("test alert", DEFAULT_VOICE_ID)
    assert k1 == k2

    # 4. Error on missing key
    audio, err = synthesize_speech("Hello", api_key="")
    assert audio is None
    assert "API key is missing" in err

if __name__ == "__main__":
    test_script_builders()
    print("All audio tests passed successfully!")
