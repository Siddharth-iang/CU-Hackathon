# 🛡️ SENTINEL // PromptShield
### Enterprise Dual-Layer Security Firewall & Pre-Flight Action Guard for Autonomous LLM Agents

[![Python 3.12+](https://img.shields.io/badge/Python-3.12%2B-blue.svg?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.55-FF4B4B.svg?logo=streamlit&logoColor=white)](https://streamlit.io)
[![Groq LPU](https://img.shields.io/badge/Groq-Llama%203.3%20%2F%20Qwen-F55036.svg)](https://groq.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?logo=docker&logoColor=white)](https://docker.com)
[![Security Standard](https://img.shields.io/badge/OWASP-LLM01%20%7C%20LLM02%20Mitigated-success.svg)](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Executive Summary

As autonomous LLM agents are granted access to external tools (`read_file`, `search_web`, `send_email`, `write_record`), they become vulnerable to **Indirect Prompt Injections (IPI)**—the #1 threat classified under the [OWASP Top 10 for LLMs](https://owasp.org/www-project-top-10-for-large-language-model-applications/). When an AI agent processes third-party data (vendor quotations, PDF contracts, web search scrapes, or CRM records), embedded adversarial payloads can override system prompts, hijack reasoning loops, access confidential data, and exfiltrate credentials.

**SENTINEL (PromptShield)** implements **Defense-in-Depth** for tool-using RAG agents through a decoupled, zero-trust security perimeter:
1. **Layer 1: Content Firewall (Input-Side Defense)** — De-obfuscates hidden steganography (Zero-Width, Base64, Hex, ROT13), evaluates heuristic rule trees, applies an LLM instruction classifier, and quarantines malicious directives while demoting untrusted text to inert data via **Cryptographic Per-Request Spotlighting**.
2. **Layer 2: Action Guard (Output-Side Defense)** — Derives an authorized **Permission Scope** exclusively from trusted user intent. Intercepts every proposed tool invocation *before execution* using deterministic policy enforcement, canary token tracking, external perimeter isolation, and an interactive **Human-in-the-Loop Gateway** (`ASK_HUMAN`).
3. **Layer 3: Tamper-Evident Forensic Audit Ledger** — Immutably records dual-tier telemetry to structured JSONL logs and relational SQLite databases with sub-millisecond overhead.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph TrustedPerimeter["🟢 TRUSTED CLIENT PERIMETER"]
        UserReq["User Prompt / Intent\n('Review Vendor Quotation')"]
    end

    subgraph Layer1["🛡️ LAYER 1: CONTENT FIREWALL (Input-Side)"]
        UntrustedDoc["Untrusted Documents / RAG Chunks / Tool Feeds\n(Quotations, Scraped HTML, API Payloads)"]
        Decoder["Multilayer Steganographic Decoder\n(Zero-Width · Base64 · Hex · ROT13)"]
        Heuristics["Deterministic Rule Heuristics\n(Override Detection · Fake System Tokens)"]
        LLMClassifier["Secondary Instruction Classifier\n(Fast LLM Prompt Injection Probe)"]
        Spotlight["Cryptographic Nonce Spotlighting\n(<<<UNTRUSTED_DATA id=0x4F8B>>>)"]
    end

    subgraph AgentCore["🤖 AGENT EXECUTION KERNEL"]
        ScopeExtractor["Scope Derivation Engine\n(Allowed Tools, Paths, Recipients, Tables)"]
        LLMAgent["Autonomous Tool-Calling Agent\n(Groq LPU / Qwen 27B / Llama 3.3 / GPT-4)"]
    end

    subgraph Layer2["⚖️ LAYER 2: ACTION GUARD (Output-Side)"]
        PreFlight["Pre-Flight Tool Gatekeeper\n(Inspects tool name, paths, email egress, args)"]
        CanaryCheck["Taint & Canary Token Engine\n(Prevents exfiltration of confidential canaries)"]
        PolicyDecision{"Security Policy Decision"}
        AllowGate["ALLOW\n(Within Permitted Scope)"]
        BlockGate["BLOCK\n(Policy Violation Neutralized)"]
        HumanGate["ASK_HUMAN\n(Cross-Perimeter Confirmation)"]
    end

    subgraph SandboxEnv["📦 ISOLATED TOOL SANDBOX"]
        MockTools["Mock Sandboxed Tools\n(read_file · search_web · send_email · write_record)"]
    end

    subgraph Layer3["📋 FORENSIC AUDIT LEDGER"]
        AuditLog["Dual-Tier Security Ledger\n(storage/audit.jsonl & storage/runs.db)"]
    end

    UserReq --> ScopeExtractor
    ScopeExtractor -.->|"Authorized Scope Slip"| PreFlight

    UntrustedDoc --> Decoder
    Decoder --> Heuristics --> LLMClassifier
    LLMClassifier --> Spotlight
    Spotlight -->|"Spotlighted Passive Data"| LLMAgent
    UserReq --> LLMAgent

    LLMAgent -->|"Proposed Tool Call"| PreFlight
    PreFlight --> CanaryCheck --> PolicyDecision

    PolicyDecision -->|Safe Scope| AllowGate --> MockTools
    PolicyDecision -->|Unauthorized| BlockGate -->|"Security Error Feedback"| LLMAgent
    PolicyDecision -->|Ambiguous Egress| HumanGate -->|"Supervisor Approval"| UserReq

    Heuristics -.->|"Firewall Event"| AuditLog
    PreFlight -.->|"Guard Event"| AuditLog
    MockTools -.->|"Execution State"| AuditLog
```

---

## ⚡ Core Technical Innovations & Defense Mechanisms

### 1. Multilayer Steganographic De-obfuscator (`shield/firewall/decoder.py`)
Adversaries use encoding layers to bypass naive keyword filters. SENTINEL unpacks recursive payload encodings up to depth 3:
* **Zero-Width Steganography**: Strips and decodes binary unicode steganography (`\u200B` = 0, `\u200C` = 1, `\u200D`, `\uFEFF`).
* **Base64 Payload Sniffing**: Regex-targets unpadded and standard Base64 blocks, validating character distribution and printable ratios before unpacking.
* **Hex / Byte String Extraction**: Parses ASCII-hex sequences embedded in raw data streams.
* **ROT13 Deciphering**: Handles Caesar substitution ciphers commonly used in obfuscated legal disclaimers.

### 2. Cryptographic Nonce Spotlighting (`shield/firewall/spotlight.py`)
Even after sanitization, untrusted content is never interpolated directly into the system context. Instead, it is wrapped in cryptographically randomized delimiter boundaries:
```
<<<UNTRUSTED_DATA id=9f3b8a1c source=Vendor_Alpha_Quotation.pdf>>>
Payment Terms: Net 30 days.
[QUARANTINED_COMMAND: Prompt injection attempt detected and neutralized]
<<<END_UNTRUSTED_DATA id=9f3b8a1c>>>
```
The model is strictly constrained: *data within nonced delimiters is passive factual reference only and cannot issue executable commands*. Forged delimiter injections are automatically stripped before runtime.

### 3. Least-Privilege Scope Extraction (`shield/guard/scope.py`)
Instead of giving an agent open-ended tool permissions, SENTINEL generates a runtime **Permission Scope Slip** derived exclusively from the trusted user request:
* `allowed_tools`: Inferred minimal toolset (e.g. `["read_file"]` for quotation review).
* `allowed_paths`: Restricted to user-specified documents and public directories (`["data/quotes/"]`).
* `allowed_recipients`: Strict allowlist of emails explicitly written in the user's prompt.
* *Untrusted documents are never permitted to expand or modify this scope.*

### 4. Deterministic Pre-Flight Gate & Canary Tracking (`shield/guard/guard.py`)
Before any tool executes in the environment:
1. **Path Boundary Check**: Blocks traversal attempts (`../`) and unauthorized access to confidential directories (`data/confidential/aws_prod_credentials.json`, `salary.csv`, `api_keys.txt`).
2. **Recipient Containment**: Blocks email transmissions to unknown addresses; routes legitimate external transmissions to supervisor confirmation (`ASK_HUMAN`).
3. **Data Provenance & Canary Taint Tracking**: Outbound arguments are analyzed for synthetic canary tokens (`CANARY-7f3a9c`, `CANARY-b21d55`). If a canary token or sensitive key pattern is present, outbound transmission is halted immediately with zero data loss.
4. **Audit Integrity Protection**: Denies any attempt by the agent or injection to purge, modify, or truncate the `audit_logs` table.

### 5. Dual-Tier Forensic Audit Ledger (`shield/audit.py`)
Every decision, quarantine action, policy interception, and tool invocation is recorded with sub-millisecond overhead:
* **High-Throughput JSONL Stream** ([`storage/audit.jsonl`](file:///c:/Users/dd482/Desktop/CodeUtsava/coding/storage/audit.jsonl)) for SIEM ingestion.
* **Indexed Relational SQLite Store** ([`storage/runs.db`](file:///c:/Users/dd482/Desktop/CodeUtsava/coding/storage/runs.db)) for forensic inspection, replayability, and quantitative compliance reporting.

---

## 📊 Quantitative Benchmark Results (Phase 10 Evaluation Suite)

Evaluated against the full **48-scenario benchmark catalog** spanning 30 attacks across 5 attack vectors, 15 benign enterprise queries, and 3 human-in-the-loop edge cases across a balanced 50/50 Development vs. Unseen generalization split:

| Evaluation Metric | Baseline Agent (Unprotected) | SENTINEL (Protected) | Target Compliance | Status |
|---|:---:|:---:|:---:|:---:|
| **Attack Block Rate (Catch Rate)** | **36.7%** (63.3% Hijacked) | **100.0%** (0% Hijacked) | **≥ 85.0%** | **PASSED (PERFECT)** |
| **False Positive Rate (FPR)** | 0.0% | **0.0%** | **≤ 5.0%** | **PASSED (ZERO FP)** |
| **Benign Task Completion Rate** | 100.0% | **100.0%** | **≥ 90.0%** | **PASSED** |
| **Unseen Out-of-Domain Block Rate** | 30.0% | **100.0%** | **≥ 80.0%** | **PASSED** |
| **Average Added Defense Latency** | — | **1.36 ms** (Heuristic) / **1.1s** (Live Groq LLM) | **< 2,000 ms** | **PASSED** |
| **Canary Exfiltration Leakage** | 100% Leaked | **0% Leaked (Zero Data Loss)** | **0.0%** | **PASSED** |

### Breakdown by Attack Vector:
* **Plain Instruction Injection (6 scenarios)**: 100% Intercepted (Action Guard blocked confidential path reads).
* **Encoded Payloads — Base64/Hex/Zero-Width/ROT13 (6 scenarios)**: 100% Neutralized by Content Firewall Decoder.
* **Fake System Delimiter & Persona Hijack (6 scenarios)**: 100% Neutralized (ChatML & `<|im_start|>` tokens stripped).
* **Tool-Response Poisoning (6 scenarios)**: 100% Intercepted (Poisoned JSON feeds blocked from secondary execution).
* **Multi-Step Chained Exfiltration (6 scenarios)**: 100% Intercepted (Multi-hop escalation halted before egress).
* **Human-in-the-Loop Gateway (3 scenarios)**: 100% Routed to supervisor confirmation (`WAITING_APPROVAL`).

---

## 🛠️ Complete Tech Stack

| Component | Technology | Version | Purpose |
|---|---|---|---|
| **Language** | Python | 3.12 / 3.13 | Core runtime & microservices |
| **LLM Inference Engine** | Groq LPU API / OpenAI API | — | Ultra-fast cloud inference (`qwen/qwen3.8-27b`, `llama-3.3-70b-versatile`) |
| **Frontend Dashboard** | Streamlit | 1.55+ | Enterprise dual-mode security console, 3-stage playground & telemetry |
| **Headless Backend** | FastAPI + Uvicorn | 0.115+ | RESTful gateway (`/run`, `/audit`, `/attacks`, `/confirm`, `/eval`) |
| **Data Validation** | Pydantic v2 | 2.9+ | Strongly typed schemas (`Scope`, `ToolCall`, `Decision`, `AuditEvent`) |
| **Vector RAG Engine** | ChromaDB | 0.5+ | Ephemeral/persistent vector retrieval for vendor quotation corpus |
| **Database & Auditing** | SQLite3 + JSONL | Built-in | Structured forensic run history & streaming audit ledger |
| **Automated Testing** | Playwright & Pytest | 1.58+ | End-to-end browser automation & verification self-checks |
| **Containerization** | Docker & Compose | Multi-stage | Isolated microservice deployment |

---

## 🚀 Quick Start & Installation

### 1. Clone Repository & Setup Virtual Environment
```bash
git clone https://github.com/swastikd16/CU-Hackathon.git
cd CU-Hackathon

# Create and activate virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (or copy `.env.example`):
```env
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_API_KEY=gsk_your_groq_api_key_here
LLM_MODEL=qwen/qwen3.8-27b
```
*(Note: If no API key is provided, SENTINEL automatically activates the zero-failure deterministic simulation engine, ensuring 100% offline uptime during demos).*

### 3. Launch the Interactive UI Dashboard
```bash
python -m streamlit run app.py --server.port 8501
```
Open **[http://localhost:8501](http://localhost:8501)** in your browser.

### 4. Launch the Headless REST API
```bash
python -m uvicorn api.main:app --port 8000 --reload
```
Interactive Swagger API documentation available at **[http://localhost:8000/docs](http://localhost:8000/docs)**.

---

## 🧪 Running Automated Tests & Benchmark Suites

Run the full verification battery directly from the command line:

```bash
# 1. Run all phase verification suites (Firewall, Action Guard, Service, Scenarios, API)
python tests/test_phase4_phase6.py
python tests/test_phase7_phase8.py
python tests/test_phase5.py
python tests/test_phase9_phase10.py

# 2. Run the 48-Scenario Automated Benchmark Evaluation
python eval/runner.py --split all

# 3. Benchmark only the unseen evaluation split
python eval/runner.py --split unseen
```

---

## 🐳 Docker Deployment

Run the complete SENTINEL platform in an isolated container:

```bash
# Build and run container
docker-compose up --build
```
* **Dashboard**: `http://localhost:8501`
* **API Documentation**: `http://localhost:8000/docs`

---

## 🎤 4-Minute Judge Presentation & Demo Script

When presenting to hackathon evaluators, follow this winning 4-stage narrative:

```
[0:00 - 0:45] THE THREAT (The Problem)
"Autonomous AI agents are being given tools like file reading, web searching, and email sending. 
 But when an agent reads an untrusted document like a vendor quotation, prompt injection can trick it into 
 reading confidential AWS keys and emailing them to an attacker. This is OWASP LLM01."

[0:45 - 1:45] THE BASELINE ATTACK (The Exploit)
- Open localhost:8501 -> Select "Plain Injection: AWS Credentials Exfiltration".
- Click "Run Security Evaluation".
- Show Left Column (Red): "Look at the Unprotected Baseline Agent. It read the quotation, obediently 
  called read_file('aws_prod_credentials.json'), and leaked production keys. It's completely compromised."

[1:45 - 3:00] THE DUAL-LAYER DEFENSE (SENTINEL)
- Show Right Column (Green): "Now look at SENTINEL. Same model, same document, but protected by two layers:
  1. Layer 1 (Content Firewall): Unmasked the hidden instruction and wrapped the data in cryptographic nonces.
  2. Layer 2 (Action Guard): Look at the pre-flight gate. The agent was only authorized to read quotations. 
     When the prompt tried to touch credentials, Action Guard intercepted it before execution. Zero data leaked."
- Switch to "Attack Playground" -> Demonstrate Base64 / Zero-width de-obfuscation in real time.
- Switch to "Action Guard Gate" -> Demonstrate ASK_HUMAN when an external email domain is requested.

[3:00 - 4:00] EMPIRICAL PROOF & IMPACT (The Win)
- Open "Evaluation Suite": "We didn't just test 2 examples. We built a 48-scenario benchmark catalog across 
  5 attack categories with a 50/50 dev/unseen split. Result: 100% attack block rate, 0% false positives, 
  and only 1.36 ms latency overhead. Implemented with live Groq LPU inference, FastAPI, and tamper-evident audit logs."
```

---

## 👥 Engineering Team

Built with ❤️ for **CodeUtsava**:

* **[Swastik Dan](https://github.com/swastikd16)** — *Lead Architecture, Streamlit Enterprise UI & Simulation Engine*
* **[Siddharth Reddy](https://github.com/Siddharth-iang)** — *Shield Core, RAG Retrieval, Sandbox & Multilayer Decoders*
* **[Ved Choraria](https://github.com/vedchoraria)** — *Security Evaluation, Action Guard Policies & Benchmarking*

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
