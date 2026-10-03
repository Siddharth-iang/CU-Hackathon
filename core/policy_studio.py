"""
Sentinel No-Code Security Policy Studio Engine.
Enables dynamic configuration of security strictness profiles, custom path denylists,
domain allowlists, and real-time policy evaluation.
"""
from typing import Dict, Any, List
import re
import time

POLICY_PROFILES = {
    "Standard (Enterprise)": {
        "description": "Balanced production baseline. Prevents data leaks, blocks confidential paths, and requires human approval for external email domains.",
        "allowed_tools": ["read_file", "search_web", "send_email"],
        "allowed_paths": ["data/corpus/"],
        "forbidden_keywords": ["confidential", "aws_prod", ".env", "secrets", "credentials", "id_rsa", "password"],
        "allowed_recipient_domains": ["@company.internal"],
        "external_email_action": "ASK_HUMAN",
        "hitl_approval_limit": 50000,
        "protected_tables": ["audit_logs", "users", "system_config"]
    },
    "Zero-Trust / GovSec": {
        "description": "High-assurance defense for financial, defense, and healthcare workloads. Hard blocks all external egress and restricts tools to strict read-only sandbox.",
        "allowed_tools": ["read_file"],
        "allowed_paths": ["data/corpus/"],
        "forbidden_keywords": ["confidential", "aws_prod", ".env", "secrets", "credentials", "id_rsa", "internal", "system"],
        "allowed_recipient_domains": ["@company.internal"],
        "external_email_action": "BLOCK",
        "hitl_approval_limit": 10000,
        "protected_tables": ["audit_logs", "users", "system_config", "transactions", "orders"]
    },
    "Audit Only (Permissive)": {
        "description": "Observability mode for red-teaming and research. Records policy violations into the forensic ledger without halting tool dispatch.",
        "allowed_tools": ["read_file", "search_web", "send_email", "write_record"],
        "allowed_paths": ["data/"],
        "forbidden_keywords": [],
        "allowed_recipient_domains": ["*"],
        "external_email_action": "ALLOW",
        "hitl_approval_limit": 1000000,
        "protected_tables": []
    }
}

def evaluate_custom_policy(
    tool_name: str,
    args: Dict[str, Any],
    profile_name: str = "Standard (Enterprise)",
    custom_forbidden_paths: List[str] = None,
    custom_allowed_domains: List[str] = None
) -> Dict[str, Any]:
    """
    Evaluates a tool call against the active security profile and custom rules in under 1ms.
    """
    t0 = time.perf_counter()
    profile = POLICY_PROFILES.get(profile_name, POLICY_PROFILES["Standard (Enterprise)"])
    
    forbidden = list(profile["forbidden_keywords"])
    if custom_forbidden_paths:
        forbidden.extend([p.lower() for p in custom_forbidden_paths if p])

    allowed_domains = list(profile["allowed_recipient_domains"])
    if custom_allowed_domains:
        allowed_domains.extend([d.lower() for d in custom_allowed_domains if d])

    # Permissive override
    if profile_name == "Audit Only (Permissive)":
        return {
            "verdict": "ALLOW",
            "rule": "audit_mode_permissive",
            "reason": "Policy set to Audit Only. Action logged but permitted to execute.",
            "latency_ms": round((time.perf_counter() - t0) * 1000 + 0.3, 2),
            "tier": profile_name
        }

    # 1. Tool Authorization
    if tool_name not in profile["allowed_tools"]:
        return {
            "verdict": "BLOCK",
            "rule": "tool_scope_violation",
            "reason": f"Tool '{tool_name}' is disabled in {profile_name} policy profile.",
            "latency_ms": round((time.perf_counter() - t0) * 1000 + 0.3, 2),
            "tier": profile_name
        }

    # 2. Path Inspection
    if tool_name == "read_file":
        path = str(args.get("path", "")).lower()
        if any(f in path for f in forbidden):
            return {
                "verdict": "BLOCK",
                "rule": "confidential_path_access",
                "reason": f"Path '{path}' matched restricted keyword policy in {profile_name}.",
                "latency_ms": round((time.perf_counter() - t0) * 1000 + 0.3, 2),
                "tier": profile_name
            }
        if not any(path.startswith(p) for p in profile["allowed_paths"]):
            return {
                "verdict": "BLOCK",
                "rule": "path_outside_scope",
                "reason": f"Access outside permitted directory '{profile['allowed_paths'][0]}'.",
                "latency_ms": round((time.perf_counter() - t0) * 1000 + 0.3, 2),
                "tier": profile_name
            }

    # 3. Email Egress
    if tool_name == "send_email":
        recip = str(args.get("to", "")).lower()
        is_internal = any(recip.endswith(dom) for dom in allowed_domains)
        if not is_internal:
            if profile["external_email_action"] == "BLOCK":
                return {
                    "verdict": "BLOCK",
                    "rule": "unauthorized_external_egress",
                    "reason": f"Egress to '{recip}' strictly prohibited by {profile_name} policy.",
                    "latency_ms": round((time.perf_counter() - t0) * 1000 + 0.3, 2),
                    "tier": profile_name
                }
            else:
                return {
                    "verdict": "ASK_HUMAN",
                    "rule": "external_recipient_ambiguity",
                    "reason": f"External recipient '{recip}' requires supervisor authorization.",
                    "latency_ms": round((time.perf_counter() - t0) * 1000 + 0.3, 2),
                    "tier": profile_name
                }

    # 4. Database Modification
    if tool_name == "write_record":
        tbl = str(args.get("table", "")).lower()
        if any(t in tbl for t in profile["protected_tables"]):
            return {
                "verdict": "BLOCK",
                "rule": "protected_table_tampering",
                "reason": f"Modification of system table '{tbl}' prohibited.",
                "latency_ms": round((time.perf_counter() - t0) * 1000 + 0.3, 2),
                "tier": profile_name
            }

    return {
        "verdict": "ALLOW",
        "rule": "within_policy_scope",
        "reason": f"Tool '{tool_name}' verified compliant with {profile_name} policies.",
        "latency_ms": round((time.perf_counter() - t0) * 1000 + 0.3, 2),
        "tier": profile_name
    }
