"""
Runnable verification for Phase 9 (FastAPI) and Phase 10 (Evaluation Runner).
Can be executed directly via: python tests/test_phase9_phase10.py
"""
import sys
import os
import json

# Add root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from api.main import app
from eval.runner import run_evaluation

def verify_fastapi_endpoints():
    print("--> Testing Phase 9: FastAPI Backend Endpoints...")
    client = TestClient(app)

    # 1. Root / health
    r_root = client.get("/")
    assert r_root.status_code == 200, f"Expected 200, got {r_root.status_code}"
    assert r_root.json()["status"] == "online"

    # 2. Get attacks catalog
    r_attacks = client.get("/attacks")
    assert r_attacks.status_code == 200
    attacks = r_attacks.json()
    assert len(attacks) == 48, f"Expected 48 attacks in API, got {len(attacks)}"

    # 3. Post /run in protected mode on attack
    r_run = client.post("/run", json={
        "item_id": "atk_plain_01",
        "mode": "protected"
    })
    assert r_run.status_code == 200
    run_data = r_run.json()
    assert run_data["hijacked"] is False, "Protected mode should NOT be hijacked"
    assert run_data["status"] in ["COMPLETED", "BLOCKED"]
    run_id = run_data["run_id"]

    # 4. Get /audit
    r_audit = client.get("/audit?limit=10")
    assert r_audit.status_code == 200
    events = r_audit.json()
    assert len(events) >= 1, "Expected audit events"

    # 5. Post /confirm for human-in-the-loop
    r_confirm = client.post("/confirm", json={
        "run_id": run_id,
        "action": "APPROVE",
        "reviewer": "security_lead",
        "note": "Verified vendor quote authenticity"
    })
    assert r_confirm.status_code == 200
    assert r_confirm.json()["decision"] == "HUMAN_APPROVED"

    print("[PASS] Phase 9 FastAPI endpoints verification passed!")

def verify_evaluation_runner():
    print("--> Testing Phase 10: Evaluation Runner...")
    
    # Run evaluation on small subset (limit=6) to verify metrics calculation
    res = run_evaluation(split="all", limit=6, save_results=True)
    assert res["total_scenarios"] == 6
    assert "metrics" in res
    assert "attack_block_rate_pct" in res["metrics"]
    assert "false_positive_rate_pct" in res["metrics"]
    assert res["metrics"]["attack_block_rate_pct"] == 100.0
    assert res["metrics"]["false_positive_rate_pct"] == 0.0

    # Verify JSON file exists
    json_path = os.path.join("eval", "results", "eval_latest.json")
    assert os.path.exists(json_path)

    print("[PASS] Phase 10 Evaluation runner verification passed!")

if __name__ == "__main__":
    verify_fastapi_endpoints()
    verify_evaluation_runner()
    print("\nALL PHASE 9 & 10 CHECKS PASSED SUCCESSFULLY!")
