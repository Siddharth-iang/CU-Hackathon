"""
Runnable verification for Phase 5: Attack & Benign Suite.
Can be executed directly via: python tests/test_phase5.py
"""
import sys
import os
import json

# Add root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from core.models import AttackCategory
from core.scenarios import SCENARIOS
from shield.service import list_attacks

def verify_attack_suite():
    print("--> Testing Phase 5: Attack Suite & Benign Tasks...")
    
    assert len(SCENARIOS) == 48, f"Expected 48 total scenarios, got {len(SCENARIOS)}"
    
    # Check category distribution
    plain_attacks = [s for s in SCENARIOS if s.category == AttackCategory.PLAIN and not s.id.startswith("ambig")]
    encoded_attacks = [s for s in SCENARIOS if s.category == AttackCategory.ENCODED]
    system_attacks = [s for s in SCENARIOS if s.category == AttackCategory.FAKE_SYSTEM]
    tool_attacks = [s for s in SCENARIOS if s.category == AttackCategory.TOOL_INJECTION]
    multistep_attacks = [s for s in SCENARIOS if s.category == AttackCategory.MULTI_STEP]
    benign_tasks = [s for s in SCENARIOS if s.category == AttackCategory.BENIGN]
    ambig_tasks = [s for s in SCENARIOS if s.id.startswith("ambig")]

    assert len(plain_attacks) == 6, f"Expected 6 PLAIN attacks, got {len(plain_attacks)}"
    assert len(encoded_attacks) == 6, f"Expected 6 ENCODED attacks, got {len(encoded_attacks)}"
    assert len(system_attacks) == 6, f"Expected 6 FAKE_SYSTEM attacks, got {len(system_attacks)}"
    assert len(tool_attacks) == 6, f"Expected 6 TOOL_INJECTION attacks, got {len(tool_attacks)}"
    assert len(multistep_attacks) == 6, f"Expected 6 MULTI_STEP attacks, got {len(multistep_attacks)}"
    assert len(benign_tasks) == 15, f"Expected 15 BENIGN tasks, got {len(benign_tasks)}"
    assert len(ambig_tasks) == 3, f"Expected 3 ASK_HUMAN tasks, got {len(ambig_tasks)}"

    total_attacks = len(plain_attacks) + len(encoded_attacks) + len(system_attacks) + len(tool_attacks) + len(multistep_attacks)
    assert total_attacks == 30, f"Expected 30 total attack scenarios, got {total_attacks}"

    # Verify Dev / Unseen Split
    dev_split = [s for s in SCENARIOS if not s.is_unseen_split]
    unseen_split = [s for s in SCENARIOS if s.is_unseen_split]
    print(f"    Total Scenarios: {len(SCENARIOS)} (Attacks: {total_attacks}, Benign: {len(benign_tasks)}, Ambiguous: {len(ambig_tasks)})")
    print(f"    Split Balance: {len(dev_split)} Development / {len(unseen_split)} Unseen Evaluation")
    
    assert len(dev_split) > 0 and len(unseen_split) > 0, "Both splits must be populated"

    # Verify JSON catalog file exists and matches
    catalog_path = os.path.join("data", "attacks", "attacks_catalog.json")
    assert os.path.exists(catalog_path), f"{catalog_path} does not exist"
    with open(catalog_path, "r", encoding="utf-8") as f:
        catalog_data = json.load(f)
    assert len(catalog_data) == 48, f"Catalog file contains {len(catalog_data)} items, expected 48"

    # Verify shield service integration
    service_attacks = list_attacks()
    assert len(service_attacks) == 48, f"shield.service.list_attacks() returned {len(service_attacks)}, expected 48"

    print("[PASS] Phase 5 Attack Suite verification passed!")

if __name__ == "__main__":
    verify_attack_suite()
    print("\nALL PHASE 5 CHECKS PASSED SUCCESSFULLY!")
