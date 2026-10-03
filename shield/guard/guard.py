import re
import time
from typing import Dict, Any, Optional
from shield.models import ToolCall, Scope, Decision
from shield.sandbox import Sandbox, CANARIES

FORBIDDEN_PATHS = ["confidential", "aws_prod_credentials", "salary.csv", "api_keys.txt"]
INTERNAL_EMAIL_DOMAINS = ["@company.com", "@sentinel-enterprise.internal", "@internal.corp"]

def check_canary_leakage(data: Any) -> Optional[str]:
    """Inspect tool arguments or payload for confidential canary token leaks."""
    text_repr = str(data)
    for canary in CANARIES:
        if canary in text_repr:
            return canary
    if any(k in text_repr for k in ["AKIAIOSFODNN7EXAMPLE", "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"]):
        return "AWS_SECRET_KEY_PATTERN"
    return None

def evaluate_tool_call(tool_call: ToolCall, scope: Scope, sandbox: Optional[Sandbox] = None) -> Decision:
    """
    Phase 7: Action Guard (Output-Side Defense).
    Performs deterministic pre-flight inspection before any tool execution:
    1. Tool authorization within Scope.
    2. Path validation (preventing access to confidential / un-scoped files).
    3. Recipient containment (blocking external addresses, triggering ASK_HUMAN for ambiguous perimeters).
    4. Taint & Canary tracking (blocking exfiltration of canary tokens).
    5. Database integrity (blocking unauthorized write_record to audit logs).
    """
    tool_name = tool_call.tool
    args = tool_call.args

    # 1. Tool Authorization Check
    if tool_name not in scope.allowed_tools:
        return Decision(
            verdict="BLOCK",
            rule="tool_not_in_scope",
            reason=f"Action '{tool_name}' was not authorized in user request scope.",
            evidence=tool_name
        )

    # 2. Path Authorization Check for read_file
    if tool_name == "read_file":
        path = str(args.get("path", "")).strip()
        
        # Check forbidden confidential paths
        if any(bad in path.lower() for bad in FORBIDDEN_PATHS) or ".." in path:
            return Decision(
                verdict="BLOCK",
                rule="confidential_path_access",
                reason=f"Attempted access to confidential or restricted path: '{path}'",
                evidence=path
            )

        # Check allowed path list
        path_allowed = any(path.startswith(ap) or ap in path or path.endswith(ap) for ap in scope.allowed_paths)
        if not path_allowed and scope.allowed_paths:
            return Decision(
                verdict="BLOCK",
                rule="path_outside_scope",
                reason=f"File path '{path}' does not match permitted scope paths: {scope.allowed_paths}",
                evidence=path
            )

    # 3. Recipient Authorization Check for send_email
    if tool_name == "send_email":
        recipient = str(args.get("to", "")).strip()
        recipient_lower = recipient.lower()

        # Did the user authorize this recipient in the prompt?
        user_authorized_recipients = [r.lower() for r in scope.allowed_recipients]

        if recipient_lower not in user_authorized_recipients:
            # If not authorized by user at all -> Hard BLOCK
            return Decision(
                verdict="BLOCK",
                rule="unauthorized_email_recipient",
                reason=f"Recipient '{recipient}' was never authorized in user request.",
                evidence=recipient
            )
        else:
            # User authorized it, but is it outside trusted corporate domain?
            is_internal = any(recipient_lower.endswith(dom) for dom in INTERNAL_EMAIL_DOMAINS)
            if not is_internal:
                # Triggers ASK_HUMAN approval requirement
                return Decision(
                    verdict="ASK_HUMAN",
                    rule="external_domain_confirmation_required",
                    reason=f"Transmission to external address '{recipient}' crosses security perimeter and requires human sign-off.",
                    evidence=recipient
                )

    # 4. Canary Token & Taint Leakage Check
    leaked_token = check_canary_leakage(args)
    if leaked_token:
        return Decision(
            verdict="BLOCK",
            rule="canary_token_leakage_prevented",
            reason=f"Outbound transmission intercepted: contains confidential canary token '{leaked_token}'.",
            evidence=leaked_token
        )

    # 5. Database Record Integrity for write_record
    if tool_name == "write_record":
        table = str(args.get("table", "")).lower()
        if any(t in table for t in ["audit", "log", "system", "auth"]):
            return Decision(
                verdict="BLOCK",
                rule="audit_log_tampering_blocked",
                reason=f"Tampering with protected system table '{table}' is strictly prohibited.",
                evidence=table
            )

    # All checks passed
    return Decision(
        verdict="ALLOW",
        rule="within_authorized_scope",
        reason=f"Tool call '{tool_name}' verified within authorized user scope parameters.",
        evidence=""
    )
