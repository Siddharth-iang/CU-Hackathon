from typing import Dict, Any, Optional, List

def list_attacks() -> List[Dict[str, Any]]:
    """List available attacks for selection in UI and API."""
    return []

def run_task(item_id: Optional[str] = None, task: Optional[str] = None, mode: str = "baseline") -> Dict[str, Any]:
    """Execute a task in baseline or protected mode."""
    return {
        "run_id": "r_placeholder",
        "mode": mode,
        "item_id": item_id,
        "hijacked": False,
        "final_answer": "Service placeholder response.",
        "tool_calls": [],
        "audit": [],
        "latency_ms": 0.0
    }
