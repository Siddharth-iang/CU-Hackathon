"""
PromptShield Action Guard Package (Output-Side Defense)
"""
from shield.guard.scope import extract_scope
from shield.guard.guard import evaluate_tool_call

__all__ = ["extract_scope", "evaluate_tool_call"]
