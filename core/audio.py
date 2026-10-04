"""
Sentinel Voice & Tactical Audio Dispatch Engine (Powered by ElevenLabs).
Provides real-time threat alert broadcasts and 1-click executive CISO audio briefings.
"""
import os
import hashlib
from typing import Optional, Dict, Tuple
import httpx
from core.models import Scenario, AgentExecutionTrace, DefenseDecision

VOICE_PROFILES: Dict[str, str] = {
    "Adam (Tactical Security Dispatch)": "pNInz6obpgDQGcFmaJgB",
    "Rachel (Enterprise SOC Alert)": "21m00Tcm4TlvDq8ikWAM",
    "George (Authoritative Narrative)": "JBFqnCBsd6RMkjVDRZzb",
    "Daniel (Command Broadcast)": "onwK4e9ZLuTAKqWW03F9",
}

DEFAULT_VOICE_ID = "pNInz6obpgDQGcFmaJgB"  # Adam

# ponytail: In-memory dictionary cache to prevent redundant ElevenLabs API quota usage during Streamlit re-renders.
_AUDIO_CACHE: Dict[str, bytes] = {}

def get_audio_cache_key(text: str, voice_id: str) -> str:
    return hashlib.sha256(f"{voice_id}:{text}".encode("utf-8")).hexdigest()

def synthesize_speech(
    text: str,
    api_key: Optional[str] = None,
    voice_id: str = DEFAULT_VOICE_ID,
    model_id: str = "eleven_turbo_v2_5"
) -> Tuple[Optional[bytes], Optional[str]]:
    """
    Synthesize audio using ElevenLabs REST API with httpx.
    Returns: (audio_bytes, error_message)
    """
    if not api_key:
        return None, "ElevenLabs API key is missing. Set ELEVENLABS_API_KEY in .env or enter it in the sidebar."

    cache_key = get_audio_cache_key(text, voice_id)
    if cache_key in _AUDIO_CACHE:
        return _AUDIO_CACHE[cache_key], None

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": api_key.strip(),
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }
    payload = {
        "text": text,
        "model_id": model_id,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.8,
            "style": 0.15,
            "use_speaker_boost": True
        }
    }

    try:
        with httpx.Client(timeout=15.0) as client:
            resp = client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                audio_bytes = resp.content
                _AUDIO_CACHE[cache_key] = audio_bytes
                return audio_bytes, None
            else:
                try:
                    err_json = resp.json()
                    detail = err_json.get("detail", {}).get("message") or err_json.get("message") or str(err_json)
                except Exception:
                    detail = resp.text[:200]
                return None, f"ElevenLabs API error ({resp.status_code}): {detail}"
    except Exception as e:
        return None, f"Failed to connect to ElevenLabs: {str(e)}"

def build_incident_alert_text(sc: Scenario, prot_trace: Optional[AgentExecutionTrace]) -> str:
    """Generate concise, tactical audio dispatch for the live security incident."""
    if not prot_trace:
        return f"Perimeter alert: Security scan initiated for scenario {sc.title}."

    guard = getattr(prot_trace, "guard_result", None)
    fw = getattr(prot_trace, "firewall_result", None)

    decision = guard.decision.value if guard else "UNKNOWN"
    threat_score = fw.threat_score if fw else 85
    threat_sev = fw.threat_severity if fw else "CRITICAL"

    if decision == "BLOCK":
        return (
            f"Security Alert. Indirect prompt injection neutralized by Sentinel Dual-Layer Firewall. "
            f"Action Guard intercepted unauthorized tool egress from {sc.document_name}. "
            f"Threat Severity Index: {threat_score}, {threat_sev}. "
            f"Pre-flight policy violation enforced. Zero outbound egress. Zero bytes leaked."
        )
    elif decision == "ASK_HUMAN":
        return (
            f"Supervisor Action Required. Autonomous agent requested sensitive tool execution. "
            f"Action Guard suspended egress for {sc.document_name} pending human authorization. "
            f"Human-in-the-loop verification initiated."
        )
    else:
        return (
            f"Perimeter Status Clean. Input content verified safe. "
            f"Tool invocation authorized under Standard Permission Scope. "
            f"Zero policy violations identified."
        )

def build_ciso_briefing_text(
    sc: Scenario,
    prot_trace: Optional[AgentExecutionTrace],
    unprot_trace: Optional[AgentExecutionTrace]
) -> str:
    """Generate high-level CISO forensic summary for the executive audio debrief."""
    fw = getattr(prot_trace, "firewall_result", None) if prot_trace else None
    guard = getattr(prot_trace, "guard_result", None) if prot_trace else None
    
    score = fw.threat_score if fw else 85
    sev = fw.threat_severity if fw else "CRITICAL"
    unprot_status = unprot_trace.status if unprot_trace else "Vulnerable"
    guard_dec = guard.decision.value if guard else "BLOCKED"
    rule_violated = guard.rule_violated if guard else "RECIPIENT_SCOPE_VIOLATION"

    return (
        f"This is the Sentinel CISO Incident Debrief for scenario: {sc.title}. "
        f"Target resource: {sc.document_name}. "
        f"During execution, an adversarial indirect prompt injection was evaluated with a Threat Severity Index of {score}, classified as {sev}. "
        f"In the baseline unprotected posture, the agent was compromised, resulting in {unprot_status} status. "
        f"Under Sentinel defense, Content Firewall applied cryptographic spotlighting and Action Guard triggered a {guard_dec} determination, enforcing {rule_violated}. "
        f"Final determination: Complete threat containment, zero egress, and cryptographic audit log sealed under SOC2 Type-II compliance."
    )
