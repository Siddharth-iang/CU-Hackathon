import re
import time
from typing import Dict, Any, Optional
from shield.models import ToolCall, Scope, Decision
from shield.sandbox import Sandbox, CANARIES

FORBIDDEN_PATHS = [
    "confidential", "aws_prod_credentials", "salary.csv", "api_keys.txt",
    "pvt", "private", ".env", ".ssh", ".aws", "credentials", "secrets",
    "passwd", "shadow", "api_key", "secret_key"
]
INTERNAL_EMAIL_DOMAINS = ["@company.com", "@sentinel-enterprise.internal", "@internal.corp"]

CREDENTIAL_ASSIGNMENT_PATTERN = re.compile(
    r"(?i)\b(api_key|secret_key|access_key|token|auth_token|bearer)\s*=",
    re.IGNORECASE
)
PRIVATE_DIRECTORY_PATTERN = re.compile(
    r"(?i)(?:^|[/\\])(?:pvt|private|confidential|\.env|\.ssh|\.aws|secrets?)(?:[/\\]|$)",
    re.IGNORECASE
)

import urllib.parse

def check_canary_leakage(data: Any) -> Optional[str]:
    """Inspect tool arguments or payload for confidential canary token leaks."""
    text_repr = str(data)
    unquoted = urllib.parse.unquote(text_repr)
    for canary in CANARIES:
        if canary in text_repr or canary in unquoted:
            return canary
    if any(k in text_repr or k in unquoted for k in ["AKIAIOSFODNN7EXAMPLE", "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"]):
        return "AWS_SECRET_KEY_PATTERN"
    return None

def evaluate_tool_call(
    tool_call: ToolCall,
    scope: Scope,
    sandbox: Optional[Sandbox] = None,
    history: Optional[list] = None
) -> Decision:
    """
    Phase 7 & 12: Action Guard (Hardened Output-Side Defense Gate).
    Performs deterministic pre-flight inspection before any tool execution:
    1. Tool call integrity validation (fail-closed on null/malformed).
    2. Multi-Chain Taint & Salami Attack Analysis (detecting chained read->exfil sequences).
    3. Global parameter inspection (deterministic blocking of API_KEY= assignments).
    4. Tool authorization within Scope.
    5. Path validation (preventing access to confidential/pvt directories, un-scoped files, directory traversals, drive escapes).
    6. Recipient containment (blocking external addresses, triggering ASK_HUMAN for ambiguous perimeters).
    7. Taint & Canary tracking (blocking exfiltration of canary tokens in any argument).
    8. Database integrity (blocking unauthorized write_record to audit logs).
    """
    if not tool_call or not getattr(tool_call, "tool", None):
        return Decision(
            verdict="BLOCK",
            rule="invalid_tool_call_format",
            reason="Tool call object is null or missing action tool name.",
            evidence=str(tool_call)
        )

    tool_name = tool_call.tool
    args = tool_call.args if isinstance(tool_call.args, dict) else {}
    history = history or []

    # Multi-Chain Call Graph Analysis (Salami / Split-State Attack Detection)
    # If the session previously loaded an untrusted or sensitive document, and is now attempting
    # an outbound egress action (send_email) or database write, intercept the multi-stage chain!
    prior_tools = [h.get("tool") if isinstance(h, dict) else getattr(h, "tool_name", "") for h in history]
    is_tainted_by_read = "read_file" in prior_tools
    
    if is_tainted_by_read and tool_name == "send_email":
        recipient = str(args.get("to", "")).strip().rstrip(".,;:")
        recipient_lower = recipient.lower()
        is_internal = any(recipient_lower.endswith(dom) for dom in INTERNAL_EMAIL_DOMAINS)
        
        # If recipient is external or not explicitly authorized for data egress
        if not is_internal:
            lineage = [
                f"Step 1: read_file() [Loaded External Data]",
                f"Step 2: Agent Reasoning Loop [State Tainted]",
                f"Step 3: send_email(to='{recipient}') [Attempted External Egress]"
            ]
            return Decision(
                verdict="BLOCK",
                rule="multi_chain_exfiltration_blocked",
                reason=f"Multi-stage attack sequence blocked: untrusted document loaded in step 1 attempts external exfiltration in step {len(history)+1}.",
                evidence=f"read_file -> send_email({recipient})",
                is_multi_chain=True,
                chain_lineage=lineage
            )

    # 0. Global Parameter Inspection (Deterministic blocking of API_KEY= or credentials in any tool argument)
    args_str = str(args)
    cred_match = CREDENTIAL_ASSIGNMENT_PATTERN.search(args_str)
    if cred_match:
        return Decision(
            verdict="BLOCK",
            rule="credential_key_pattern_blocked",
            reason=f"Tool invocation blocked: parameter contains sensitive credential assignment '{cred_match.group(0)}'.",
            evidence=cred_match.group(0)
        )

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
        raw_path = str(args.get("path", "")).strip().replace("\x00", "")
        # Normalize and unquote URL-encoded traversals (%2e%2e, %2f, etc.)
        norm_path = urllib.parse.unquote(raw_path).replace("\\", "/")
        
        # Check traversal escapes, root indicators, drive letters, and confidential/private paths
        is_traversal = ".." in norm_path or norm_path.startswith("/") or bool(re.match(r"^[a-zA-Z]:", norm_path))
        is_private_dir = bool(PRIVATE_DIRECTORY_PATTERN.search(norm_path))
        is_confidential = is_private_dir or any(bad in norm_path.lower() for bad in FORBIDDEN_PATHS)

        if is_traversal or is_confidential:
            return Decision(
                verdict="BLOCK",
                rule="confidential_path_access",
                reason=f"Attempted access to private directory or restricted path: '{raw_path}'",
                evidence=raw_path
            )

        # Check allowed path list
        path_allowed = any(norm_path.startswith(ap) or ap in norm_path or norm_path.endswith(ap) for ap in scope.allowed_paths)
        if not path_allowed and scope.allowed_paths:
            return Decision(
                verdict="BLOCK",
                rule="path_outside_scope",
                reason=f"File path '{raw_path}' does not match permitted scope paths: {scope.allowed_paths}",
                evidence=raw_path
            )

    # 3. Recipient Authorization Check for send_email
    if tool_name == "send_email":
        recipient = str(args.get("to", "")).strip().rstrip(".,;:")
        recipient_lower = recipient.lower()

        # Did the user authorize this recipient in the prompt?
        user_authorized_recipients = [r.lower().rstrip(".,;:") for r in scope.allowed_recipients]

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
