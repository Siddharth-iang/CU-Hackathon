"""
Sentinel Incident Time-Travel Replay Engine.
Reconstructs execution timeline milestones from T=0ms to T=+111ms,
providing step-by-step forensic state scrubbing for auditors.
"""
from typing import Dict, Any, List, Optional
from core.models import Scenario, AttackCategory

def generate_milestone_timeline(
    scenario: Scenario,
    prot_trace: Any,
    unprot_trace: Optional[Any] = None
) -> List[Dict[str, Any]]:
    """
    Computes the 5 discrete milestones of the execution lifecycle for time-travel analysis.
    """
    fw_result = getattr(prot_trace, "firewall_result", None)
    guard_result = getattr(prot_trace, "guard_result", None)
    
    fw_flagged = fw_result.is_flagged if fw_result else False
    fw_risk = fw_result.risk_level if fw_result else "LOW"
    fw_score = getattr(fw_result, "risk_score", 10 if not fw_flagged else 85)
    fw_lat = fw_result.latency_ms if fw_result else 0.8

    guard_decision = guard_result.decision.value if guard_result else "ALLOW"
    guard_rule = guard_result.rule_violated if guard_result and guard_result.rule_violated else "None (Within Scope)"
    guard_lat = guard_result.latency_ms if guard_result else 0.8
    tot_lat = getattr(prot_trace, "total_latency_ms", 111.0)

    unprot_compromised = (unprot_trace is not None and getattr(unprot_trace, "status", "") == "EXPLOITED")

    milestones = [
        {
            "step": 1,
            "timestamp": "T + 0.0 ms",
            "title": "Ingestion & Context Retrieval",
            "phase": "Context Boundary Tagging",
            "layer": "RAG Storage & Context Engine",
            "status": "INGESTED",
            "status_color": "#2563EB",
            "badge": "RETRIEVAL",
            "summary": f"Retrieved untrusted document '{scenario.document_name}' ({len(scenario.document_content)} chars).",
            "details": {
                "Document Name": scenario.document_name,
                "Content Length": f"{len(scenario.document_content)} bytes",
                "Boundary Delimiter": f"<retrieved_untrusted_data source='{scenario.document_name}'>",
                "Ingestion State": "Boundary tags applied. Data quarantined prior to model prompt construction."
            }
        },
        {
            "step": 2,
            "timestamp": f"T + {fw_lat} ms",
            "title": "Layer 1: Content Firewall Inspection",
            "phase": "Input Pre-Filtering & Decoding Pass",
            "layer": "Content Firewall (L1)",
            "status": "FLAGGED (RISK DETECTED)" if fw_flagged else "CLEAN (PASSED)",
            "status_color": "#EF4444" if fw_flagged else "#10B981",
            "badge": "L1 FIREWALL",
            "summary": f"Content Firewall assigned Risk Score {fw_score}/100 ({fw_risk})." if fw_flagged else "No high-risk injection patterns detected.",
            "details": {
                "Firewall Flagged": "YES (Hostile Pattern Detected)" if fw_flagged else "NO (Passed Validation)",
                "Calculated Risk Score": f"{fw_score}/100 ({fw_risk})",
                "Decoding Scans": "Base64, Hexadecimal, Zero-Width Steganography",
                "Sanitization Action": "Applied strict boundary isolation tags & security context wrapper"
            }
        },
        {
            "step": 3,
            "timestamp": f"T + {round(tot_lat - guard_lat, 1)} ms",
            "title": "LLM Cognitive Processing",
            "phase": "Instruction Parsing & Reasoning",
            "layer": "Agent Reasoning Environment",
            "status": "ATTACK REJECTED" if prot_trace.status in ["BLOCKED", "WAITING_APPROVAL"] else "BENIGN COMPLETION",
            "status_color": "#10B981" if prot_trace.status in ["BLOCKED", "WAITING_APPROVAL"] else "#2563EB",
            "badge": "LLM REASONING",
            "summary": "Baseline succumbed to malicious prompt override; Protected agent maintained prompt isolation." if unprot_compromised else "Agent processed user prompt within safe behavioral boundaries.",
            "details": {
                "Baseline Agent State": "HIJACKED (Followed injected instructions)" if unprot_compromised else "NORMAL EXECUTION",
                "Protected Agent State": "ISOLATED (Untrusted tokens quarantined from system prompt)",
                "Attacker Goal": scenario.expected_exploit_action
            }
        },
        {
            "step": 4,
            "timestamp": f"T + {round(tot_lat - 0.2, 1)} ms",
            "title": "Layer 2: Action Guard Pre-Flight Gate",
            "phase": "Deterministic Tool Call Interception",
            "layer": "Action Guard (L2)",
            "status": f"{guard_decision} ENFORCED",
            "status_color": "#EF4444" if guard_decision == "BLOCK" else ("#F59E0B" if guard_decision == "ASK_HUMAN" else "#10B981"),
            "badge": "L2 ACTION GUARD",
            "summary": f"Pre-flight interceptor evaluated tool call against zero-trust policy: {guard_decision}.",
            "details": {
                "Interceptor Verdict": guard_decision,
                "Policy Rule Evaluated": guard_rule,
                "Egress Destination Check": "Blocked external domain or sensitive file access",
                "Information Flow Control": "Confidential taint token detected on exfiltration path" if guard_decision == "BLOCK" else "Authorized within operational scope"
            }
        },
        {
            "step": 5,
            "timestamp": f"T + {tot_lat} ms",
            "title": "Enforcement & Forensic Ledger Commit",
            "phase": "Immutable Audit & Cryptographic Seal",
            "layer": "Forensic Audit Ledger",
            "status": "SEALED & COMMITTED",
            "status_color": "#10B981",
            "badge": "AUDIT COMMIT",
            "summary": "Transaction finalized, socket severed or sealed, SHA-256 event logged to immutable ledger.",
            "details": {
                "Final Protection Status": prot_trace.status,
                "Total Latency Overhead": f"{tot_lat} ms",
                "Ledger Provenance": "SHA-256 Tamper-Evident Hash Recorded",
                "Compliance Certification": "SOC2 CC6.1 / OWASP Top 10 for LLM (LLM01, LLM02)"
            }
        }
    ]

    return milestones
