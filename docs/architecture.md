# 🛡️ SENTINEL // PromptShield — End-to-End System Architecture

> **Notice:** The canonical comprehensive architecture document is maintained at [`architecture.md`](file:///c:/Users/dd482/Desktop/CodeUtsava/coding/architecture.md) in the project root.

Please refer to [`architecture.md`](file:///c:/Users/dd482/Desktop/CodeUtsava/coding/architecture.md) for the complete, full-depth architectural breakdown including:
- Zero-Trust Security Perimeter & Threat Model
- Global Architecture Diagrams & Sequence Diagrams
- Layer 1: Input-Side Content Firewall (`shield/firewall/`)
- Layer 2: Output-Side Action Guard Pre-Flight Gate (`shield/guard/`)
- Layer 3: Agent Kernel & Isolated Tool Sandbox (`shield/agent.py`, `shield/sandbox.py`)
- Layer 4: Forensic Audit Ledger & SOC2/OWASP Reporting (`shield/audit.py`, `core/reporting.py`)
- Layer 5: Incident Time-Travel Forensic Replay (`core/replay.py`)
- Layer 6: Adversarial Red-Team Fuzzer & No-Code Policy Studio (`core/fuzzer.py`, `core/policy_studio.py`)
- Layer 7: Tactical Audio Dispatch Engine (`core/audio.py`)
- Layer 8: Client Interfaces & FastAPI REST Gateway (`api/main.py`, `app.py`, `frontend/`)
- Layer 9: Automated 48-Scenario Evaluation Suite (`eval/runner.py`, `core/scenarios.py`)
- Complete Code Map & Component Responsibilities
