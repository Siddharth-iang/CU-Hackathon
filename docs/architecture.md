# PromptShield System Architecture

PromptShield implements **Defense in Depth** around a tool-using RAG agent to prevent indirect prompt injection attacks.

```
                  +-------------------+      +-----------------+
                  |   User Request    | ---> | Scope Extractor |
                  |    (TRUSTED)      |      |                 |
                  +-------------------+      +-----------------+
                            |                         |
                            v                         v
+------------------+   +----------+   +---------+   +----------+   +-------------------+
|  Docs / Web /    | ->| Content  | ->|  Agent  | ->|  Action  | ->|    Mock Tools     |
|  Tool Output     |   | Firewall |   | (Llama) |   |  Guard   |   | (read/search/     |
|   (UNTRUSTED)    |   +----------+   +---------+   +----------+   |  email/write)     |
+------------------+        |                             |        +-------------------+
                            v                             v
                       +---------------------------------------+
                       |    Audit Log (JSONL / SQLite DB)       |
                       +---------------------------------------+
```

## Security Layers

1. **Content Firewall (Input-side)**
   - Normalisation & Multilayer Decoder (Base64, Hex, ROT13, Zero-Width, HTML)
   - Rule-based Heuristics
   - LLM Instruction Classifier
   - Sanitisation & Spotlighting

2. **Action Guard (Output-side)**
   - Scope Extraction (Permission slip derived solely from trusted user query)
   - Deterministic Rules
   - Provenance & Taint Tracking (Canary token leakage prevention)
   - LLM Judge (Fallback for complex ambiguities)
