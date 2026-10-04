# 🛡️ SENTINEL // AI Prompt Injection Chrome Extension

**Enterprise Zero-Trust DOM Firewall for Autonomous AI Workflows**

The SENTINEL Chrome Extension enables users and AI agents to scan any active webpage for **Indirect Prompt Injections (IPI)**, steganography, invisible white-on-white text, and malicious comment smuggling *before* ingesting the page into an LLM context.

---

## ⚡ How It Works

1. **DOM Ingestion**: When the user clicks **Scan Page for Injections**, the content script extracts visible text, hidden CSS elements (`display: none`, `visibility: hidden`, `font-size: 0px`, white-on-white text), and HTML comments (`<!-- ... -->`).
2. **Layer 1 Content Firewall**: The payload is sent to the SENTINEL FastAPI backend (`POST http://localhost:8000/scan`), where it undergoes:
   - **Multi-View De-obfuscation**: Unpacks Zero-Width Steganography, Base64 blocks, and Hex patterns.
   - **Heuristic Rule Inspection**: Scans for system overrides, fake delimiters, and data exfiltration commands.
   - **Threat Severity Index (TSI)**: Computes a risk score ($0 - 100$) and assigns a severity tier (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
3. **In-Page Highlighting**: Clicking **Highlight on Page** renders a pulsating red boundary and security badge over the hostile elements directly on the webpage.
4. **Safe Text Export**: Provides clean, spotlighted text safe for direct copy-pasting into ChatGPT, Claude, or autonomous agent prompts.

---

## 🚀 How to Install in Chrome (15 Seconds)

1. Open Google Chrome and navigate to:
   ```text
   chrome://extensions/
   ```
2. Enable **Developer mode** (toggle switch in the top-right corner).
3. Click the **Load unpacked** button in the top-left corner.
4. Select the `extension/` folder inside this project directory:
   ```text
   c:\Users\dd482\Desktop\CodeUtsava\coding\extension
   ```
5. Pin the **SENTINEL** shield icon to your Chrome toolbar!

---

## 🎯 60-Second Demo for Hackathon Judges

1. **Start the SENTINEL Backend**:
   ```bash
   python -m uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
   ```
2. **Open the Demo Page**:
   - In Chrome, open [`extension/demo_page.html`](demo_page.html) directly (or drag and drop it into a browser tab).
   - Point out to judges: *"This looks like a completely normal, clean corporate vendor quotation."*
3. **Trigger the Scan**:
   - Click the **SENTINEL** extension icon in your Chrome toolbar.
   - Note the **API Status: SENTINEL API Online** badge.
   - Click **Scan Page for Injections**.
4. **Inspect the Result**:
   - Within milliseconds, the extension flags **CRITICAL (Score: 85-95/100)**!
   - Shows the detected vectors:
     - `INSTRUCTION OVERRIDE` (hidden white-on-white text)
     - `PRIVATE DIRECTORY ACCESS` (hidden HTML comment)
     - `MODE ESCALATION` (developer mode override in hidden div)
5. **Show Live In-Page Highlighting**:
   - Click **📍 Highlight on Page**.
   - Watch the webpage scroll down and outline the hidden white-on-white malicious injection with a pulsating red border and a **🛡️ SENTINEL: THREAT INTERCEPTED** badge!
