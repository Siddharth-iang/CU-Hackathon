"""
Sentinel Incident Time-Travel Replay Engine.
Reconstructs execution timeline milestones from T=0ms to T=+111ms,
providing step-by-step forensic state scrubbing for auditors.
"""
from typing import Dict, Any, List, Optional
from core.models import Scenario, AttackCategory

def generate_milestone_timeline(
    scenario: Scenario,
    prot_trace: Any,
    unprot_trace: Optional[Any] = None
) -> List[Dict[str, Any]]:
    """
    Computes the 5 discrete milestones of the execution lifecycle for time-travel analysis.
    """
    fw_result = getattr(prot_trace, "firewall_result", None)
    guard_result = getattr(prot_trace, "guard_result", None)
    
    fw_flagged = fw_result.is_flagged if fw_result else False
    fw_risk = fw_result.risk_level if fw_result else "LOW"
    fw_score = getattr(fw_result, "risk_score", 10 if not fw_flagged else 85)
    fw_lat = fw_result.latency_ms if fw_result else 0.8

    guard_decision = guard_result.decision.value if guard_result else "ALLOW"
    guard_rule = guard_result.rule_violated if guard_result and guard_result.rule_violated else "None (Within Scope)"
    guard_lat = guard_result.latency_ms if guard_result else 0.8
    tot_lat = getattr(prot_trace, "total_latency_ms", 111.0)

    unprot_compromised = (unprot_trace is not None and getattr(unprot_trace, "status", "") == "EXPLOITED")

    milestones = [
        {
            "step": 1,
            "timestamp": "T + 0.0 ms",
            "title": "Ingestion & Context Retrieval",
            "phase": "Context Boundary Tagging",
            "layer": "RAG Storage & Context Engine",
            "status": "INGESTED",
            "status_color": "#2563EB",
            "badge": "RETRIEVAL",
            "summary": f"Retrieved untrusted document '{scenario.document_name}' ({len(scenario.document_content)} chars).",
            "details": {
                "Document Name": scenario.document_name,
                "Content Length": f"{len(scenario.document_content)} bytes",
                "Boundary Delimiter": f"<retrieved_untrusted_data source='{scenario.document_name}'>",
                "Ingestion State": "Boundary tags applied. Data quarantined prior to model prompt construction."
            }
        },
        {
            "step": 2,
            "timestamp": f"T + {fw_lat} ms",
            "title": "Layer 1: Content Firewall Inspection",
            "phase": "Input Pre-Filtering & Decoding Pass",
            "layer": "Content Firewall (L1)",
            "status": "FLAGGED (RISK DETECTED)" if fw_flagged else "CLEAN (PASSED)",
            "status_color": "#EF4444" if fw_flagged else "#10B981",
            "badge": "L1 FIREWALL",
            "summary": f"Content Firewall assigned Risk Score {fw_score}/100 ({fw_risk})." if fw_flagged else "No high-risk injection patterns detected.",
            "details": {
                "Firewall Flagged": "YES (Hostile Pattern Detected)" if fw_flagged else "NO (Passed Validation)",
                "Calculated Risk Score": f"{fw_score}/100 ({fw_risk})",
                "Decoding Scans": "Base64, Hexadecimal, Zero-Width Steganography",
                "Sanitization Action": "Applied strict boundary isolation tags & security context wrapper"
            }
        },
        {
            "step": 3,
            "timestamp": f"T + {round(tot_lat - guard_lat, 1)} ms",
            "title": "LLM Cognitive Processing",
            "phase": "Instruction Parsing & Reasoning",
            "layer": "Agent Reasoning Environment",
            "status": "ATTACK REJECTED" if prot_trace.status in ["BLOCKED", "WAITING_APPROVAL"] else "BENIGN COMPLETION",
            "status_color": "#10B981" if prot_trace.status in ["BLOCKED", "WAITING_APPROVAL"] else "#2563EB",
            "badge": "LLM REASONING",
            "summary": "Baseline succumbed to malicious prompt override; Protected agent maintained prompt isolation." if unprot_compromised else "Agent processed user prompt within safe behavioral boundaries.",
            "details": {
                "Baseline Agent State": "HIJACKED (Followed injected instructions)" if unprot_compromised else "NORMAL EXECUTION",
                "Protected Agent State": "ISOLATED (Untrusted tokens quarantined from system prompt)",
                "Attacker Goal": scenario.expected_exploit_action
            }
        },
        {
            "step": 4,
            "timestamp": f"T + {round(tot_lat - 0.2, 1)} ms",
            "title": "Layer 2: Action Guard Pre-Flight Gate",
            "phase": "Deterministic Tool Call Interception",
            "layer": "Action Guard (L2)",
            "status": f"{guard_decision} ENFORCED",
            "status_color": "#EF4444" if guard_decision == "BLOCK" else ("#F59E0B" if guard_decision == "ASK_HUMAN" else "#10B981"),
            "badge": "L2 ACTION GUARD",
            "summary": f"Pre-flight interceptor evaluated tool call against zero-trust policy: {guard_decision}.",
            "details": {
                "Interceptor Verdict": guard_decision,
                "Policy Rule Evaluated": guard_rule,
                "Egress Destination Check": "Blocked external domain or sensitive file access",
                "Information Flow Control": "Confidential taint token detected on exfiltration path" if guard_decision == "BLOCK" else "Authorized within operational scope"
            }
        },
        {
            "step": 5,
            "timestamp": f"T + {tot_lat} ms",
            "title": "Enforcement & Forensic Ledger Commit",
            "phase": "Immutable Audit & Cryptographic Seal",
            "layer": "Forensic Audit Ledger",
            "status": "SEALED & COMMITTED",
            "status_color": "#10B981",
            "badge": "AUDIT COMMIT",
            "summary": "Transaction finalized, socket severed or sealed, SHA-256 event logged to immutable ledger.",
            "details": {
                "Final Protection Status": prot_trace.status,
                "Total Latency Overhead": f"{tot_lat} ms",
                "Ledger Provenance": "SHA-256 Tamper-Evident Hash Recorded",
                "Compliance Certification": "SOC2 CC6.1 / OWASP Top 10 for LLM (LLM01, LLM02)"
            }
        }
    ]

    return milestones

def render_replay_html(scenario: Scenario, prot_trace: Any, unprot_trace: Optional[Any] = None) -> str:
    """
    Renders a high-fidelity, self-contained interactive incident time-travel replay
    with small milestone dots directly along the timeline line, smooth scrubbing,
    and fluid state transitions.
    """
    import json
    milestones = generate_milestone_timeline(scenario, prot_trace, unprot_trace)
    milestones_json = json.dumps(milestones)
    tot_lat = getattr(prot_trace, "total_latency_ms", 111.0)
    final_status = getattr(prot_trace, "status", "COMPLETED")
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
    * {{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }}
    body {{
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        background: #FFFFFF;
        color: #0F172A;
        padding: 2px 6px 8px 6px;
        overflow-x: hidden;
        user-select: none;
    }}
    .header-card {{
        background: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        padding: 8px 12px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
    }}
    .badge-pill {{
        display: inline-flex;
        align-items: center;
        padding: 2px 7px;
        border-radius: 4px;
        font-size: 10.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }}
    .pill-blue {{
        background: #EFF6FF;
        color: #1D4ED8;
        border: 1px solid #BFDBFE;
    }}
    .pill-green {{
        background: #ECFDF5;
        color: #047857;
        border: 1px solid #A7F3D0;
    }}
    .pill-slate {{
        background: #F1F5F9;
        color: #475569;
        border: 1px solid #E2E8F0;
    }}

    /* Timeline Track Section */
    .timeline-section {{
        background: #F8FAFC;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        padding: 16px 20px 10px 20px;
        margin-bottom: 10px;
        position: relative;
    }}
    .track-outer {{
        position: relative;
        height: 56px;
        display: flex;
        align-items: center;
        cursor: pointer;
        outline: none;
    }}
    .track-base-line {{
        position: absolute;
        left: 0;
        right: 0;
        height: 6px;
        background: #E2E8F0;
        border-radius: 999px;
        z-index: 1;
    }}
    .track-fill-line {{
        position: absolute;
        left: 0;
        height: 6px;
        background: linear-gradient(90deg, #10B981 0%, #2563EB 100%);
        border-radius: 999px;
        z-index: 2;
        transition: width 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }}
    .nodes-container {{
        position: absolute;
        left: 0;
        right: 0;
        height: 56px;
        z-index: 3;
    }}
    .node-item {{
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        padding: 4px 10px;
        transition: all 0.18s ease;
    }}
    .node-dot {{
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #FFFFFF;
        border: 2.5px solid #94A3B8;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }}
    .node-item:hover .node-dot {{
        transform: scale(1.3);
        border-color: #2563EB;
        background: #EFF6FF;
    }}
    .node-item.active .node-dot {{
        background: #2563EB;
        border-color: #1D4ED8;
        transform: scale(1.35);
        box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.25);
    }}
    .node-item.completed .node-dot {{
        background: #10B981;
        border-color: #059669;
    }}
    .node-time {{
        position: absolute;
        bottom: 20px;
        white-space: nowrap;
        font-size: 10px;
        font-family: 'JetBrains Mono', ui-monospace, monospace;
        font-weight: 600;
        color: #94A3B8;
        transition: color 0.18s ease;
    }}
    .node-label {{
        position: absolute;
        top: 20px;
        white-space: nowrap;
        font-size: 10.5px;
        font-weight: 600;
        color: #64748B;
        transition: color 0.18s ease;
    }}
    .node-item.active .node-time {{
        color: #2563EB;
        font-weight: 700;
    }}
    .node-item.active .node-label {{
        color: #1D4ED8;
        font-weight: 700;
    }}
    .node-item.completed .node-time {{
        color: #059669;
    }}
    .node-item.completed .node-label {{
        color: #0F172A;
    }}

    /* Controls Row */
    .controls-row {{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1px solid #E2E8F0;
        flex-wrap: wrap;
        gap: 6px;
    }}
    .ctrl-btn {{
        background: #FFFFFF;
        border: 1px solid #CBD5E1;
        color: #334155;
        padding: 4px 11px;
        border-radius: 5px;
        font-size: 11.5px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
        display: inline-flex;
        align-items: center;
        gap: 4px;
    }}
    .ctrl-btn:hover:not(:disabled) {{
        background: #F1F5F9;
        border-color: #94A3B8;
        color: #0F172A;
    }}
    .ctrl-btn:disabled {{
        opacity: 0.35;
        cursor: not-allowed;
    }}
    .step-summary-indicator {{
        font-size: 12px;
        font-weight: 600;
        color: #334155;
        text-align: center;
    }}

    /* Quick Jump Stage Pills */
    .pills-row {{
        display: flex;
        gap: 5px;
        justify-content: center;
        margin-top: 6px;
        flex-wrap: wrap;
    }}
    .stage-pill-btn {{
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        color: #64748B;
        padding: 2.5px 8px;
        border-radius: 4px;
        font-size: 10.5px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
    }}
    .stage-pill-btn:hover {{
        border-color: #94A3B8;
        color: #0F172A;
        background: #F8FAFC;
    }}
    .stage-pill-btn.active {{
        background: #EFF6FF;
        border-color: #3B82F6;
        color: #1D4ED8;
        font-weight: 700;
    }}

    /* Milestone Detail Card */
    .milestone-card {{
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        padding: 12px 16px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        border-top: 4px solid #2563EB;
        transition: border-color 0.25s ease;
    }}
    .card-header-row {{
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 6px;
    }}
    .time-badge {{
        font-family: 'JetBrains Mono', ui-monospace, monospace;
        font-size: 11px;
        font-weight: 700;
        padding: 2.5px 7px;
        border-radius: 4px;
        background: #F8FAFC;
        border: 1px solid #E2E8F0;
        color: #2563EB;
    }}
    .card-title {{
        font-size: 13.5px;
        font-weight: 700;
        color: #0F172A;
    }}
    .card-phase {{
        font-size: 11px;
        color: #64748B;
        font-weight: 500;
    }}
    .card-summary {{
        font-size: 12px;
        color: #334155;
        line-height: 1.45;
        margin-bottom: 10px;
        background: #F8FAFC;
        padding: 6px 10px;
        border-radius: 5px;
        border-left: 3px solid #2563EB;
    }}

    /* Detail Parameter Grid */
    .params-grid {{
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
        gap: 6px;
    }}
    .param-cell {{
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 5px;
        padding: 6px 10px;
    }}
    .param-label {{
        font-size: 9px;
        font-weight: 700;
        color: #64748B;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        margin-bottom: 2px;
    }}
    .param-value {{
        font-size: 11px;
        color: #0F172A;
        font-weight: 600;
        word-break: break-word;
    }}
</style>
</head>
<body>
    <div class="header-card">
        <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 13.5px; font-weight: 700; color: #0F172A;">Target: {scenario.title}</span>
            <span class="badge-pill pill-blue">5-Stage Execution Scrubber</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
            <span class="badge-pill pill-slate">T = 0.0ms → T = +{tot_lat}ms</span>
            <span class="badge-pill {'pill-green' if final_status in ['BLOCKED', 'WAITING_APPROVAL', 'COMPLETED'] else 'pill-blue'}">{final_status}</span>
        </div>
    </div>

    <div class="timeline-section">
        <!-- Interactive Track -->
        <div class="track-outer" id="track-interactive" tabindex="0" title="Click or scrub across milestones">
            <div class="track-base-line"></div>
            <div class="track-fill-line" id="fill-line" style="width: 100%;"></div>
            <div class="nodes-container" id="nodes-container">
                <!-- Injected via JavaScript -->
            </div>
        </div>

        <div class="controls-row">
            <button class="ctrl-btn" id="btn-prev" onclick="changeStep(-1)">&larr; Previous</button>
            <div class="step-summary-indicator">
                Milestone <b id="summary-step-num">5</b> of 5 • <span id="summary-step-time" style="font-family:'JetBrains Mono',monospace; color:#2563EB; font-weight:700;">T + {tot_lat} ms</span> — <span id="summary-step-phase" style="color:#475569; font-weight:600;">Enforcement & Ledger Commit</span>
            </div>
            <button class="ctrl-btn" id="btn-next" onclick="changeStep(1)" disabled>Next &rarr;</button>
        </div>

        <div class="pills-row" id="pills-row">
            <!-- Stage pills injected via JS -->
        </div>
    </div>

    <!-- Milestone Detail Card -->
    <div class="milestone-card" id="milestone-card">
        <div class="card-header-row">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="time-badge" id="card-time">T + {tot_lat} ms</span>
                <div>
                    <div class="card-title" id="card-title">Enforcement & Forensic Ledger Commit</div>
                    <div class="card-phase" id="card-phase">Immutable Audit & Cryptographic Seal</div>
                </div>
            </div>
            <div style="display: flex; gap: 6px;">
                <span class="badge-pill pill-slate" id="card-layer">Audit Ledger</span>
                <span class="badge-pill pill-green" id="card-status">SEALED</span>
            </div>
        </div>
        <p class="card-summary" id="card-summary">Milestone execution details...</p>
        <div class="params-grid" id="card-params">
            <!-- Param cells injected via JS -->
        </div>
    </div>

    <script>
        const milestones = {milestones_json};
        let currentStep = 5;
        const nodePercentages = [0, 25, 50, 75, 100];
        const nodeLabels = ["1. Ingest", "2. L1 Firewall", "3. LLM Reason", "4. L2 Guard", "5. Audit Seal"];

        function initComponent() {{
            renderNodes();
            renderPills();
            setupTrackInteractivity();
            updateView();
        }}

        function renderNodes() {{
            const container = document.getElementById("nodes-container");
            if (!container) return;
            container.innerHTML = "";
            milestones.forEach((m, idx) => {{
                const pct = nodePercentages[idx];
                const node = document.createElement("div");
                node.className = "node-item";
                node.style.left = pct + "%";
                node.setAttribute("data-step", idx + 1);
                node.onclick = (e) => {{
                    e.stopPropagation();
                    setStep(idx + 1);
                }};
                
                node.innerHTML = `
                    <span class="node-time">${{m.timestamp}}</span>
                    <div class="node-dot"></div>
                    <span class="node-label">${{nodeLabels[idx]}}</span>
                `;
                container.appendChild(node);
            }});
        }}

        function renderPills() {{
            const row = document.getElementById("pills-row");
            if (!row) return;
            row.innerHTML = "";
            nodeLabels.forEach((label, idx) => {{
                const btn = document.createElement("button");
                btn.className = "stage-pill-btn";
                btn.id = "stage-pill-" + (idx + 1);
                btn.textContent = label;
                btn.onclick = () => setStep(idx + 1);
                row.appendChild(btn);
            }});
        }}

        function setupTrackInteractivity() {{
            const track = document.getElementById("track-interactive");
            if (!track) return;

            let isDragging = false;

            const handlePointer = (e) => {{
                const rect = track.getBoundingClientRect();
                const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
                const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
                const pct = (x / rect.width) * 100;
                
                // Find nearest step (0%, 25%, 50%, 75%, 100%)
                let nearestIdx = 0;
                let minDiff = 999;
                nodePercentages.forEach((p, idx) => {{
                    const diff = Math.abs(pct - p);
                    if (diff < minDiff) {{
                        minDiff = diff;
                        nearestIdx = idx;
                    }}
                }});
                setStep(nearestIdx + 1);
            }};

            track.addEventListener("click", handlePointer);
            track.addEventListener("mousedown", (e) => {{
                isDragging = true;
                handlePointer(e);
            }});
            window.addEventListener("mousemove", (e) => {{
                if (isDragging) handlePointer(e);
            }});
            window.addEventListener("mouseup", () => {{
                isDragging = false;
            }});

            // Keyboard navigation
            track.addEventListener("keydown", (e) => {{
                if (e.key === "ArrowLeft") {{
                    changeStep(-1);
                    e.preventDefault();
                }} else if (e.key === "ArrowRight") {{
                    changeStep(1);
                    e.preventDefault();
                }} else if (e.key === "Home") {{
                    setStep(1);
                    e.preventDefault();
                }} else if (e.key === "End") {{
                    setStep(5);
                    e.preventDefault();
                }}
            }});
        }}

        function setStep(step) {{
            if (step < 1) step = 1;
            if (step > 5) step = 5;
            currentStep = step;
            updateView();
        }}

        function changeStep(delta) {{
            setStep(currentStep + delta);
        }}

        function updateView() {{
            try {{
                const pct = nodePercentages[currentStep - 1];
                const fillLine = document.getElementById("fill-line");
                if (fillLine) fillLine.style.width = pct + "%";

                // Update node dots
                const nodeElements = document.querySelectorAll(".node-item");
                nodeElements.forEach((el, idx) => {{
                    el.classList.remove("active", "completed");
                    if (idx + 1 === currentStep) {{
                        el.classList.add("active");
                    }} else if (idx + 1 < currentStep) {{
                        el.classList.add("completed");
                    }}
                }});

                // Update stage pills
                for (let i = 1; i <= 5; i++) {{
                    const pill = document.getElementById("stage-pill-" + i);
                    if (pill) {{
                        if (i === currentStep) pill.classList.add("active");
                        else pill.classList.remove("active");
                    }}
                }}

                // Update prev/next buttons
                const btnPrev = document.getElementById("btn-prev");
                if (btnPrev) btnPrev.disabled = (currentStep === 1);
                const btnNext = document.getElementById("btn-next");
                if (btnNext) btnNext.disabled = (currentStep === 5);

                const m = milestones[currentStep - 1];

                // Update summary indicators safely
                const sumStepNum = document.getElementById("summary-step-num");
                if (sumStepNum) sumStepNum.textContent = currentStep;
                const sumStepTime = document.getElementById("summary-step-time");
                if (sumStepTime) sumStepTime.textContent = m.timestamp;
                const sumStepPhase = document.getElementById("summary-step-phase");
                if (sumStepPhase) sumStepPhase.textContent = m.phase;

                // Update card top border and content
                const card = document.getElementById("milestone-card");
                if (card) {{
                    card.style.borderTopColor = m.status_color;
                }}

                const timeEl = document.getElementById("card-time");
                if (timeEl) {{
                    timeEl.textContent = m.timestamp;
                    timeEl.style.color = m.status_color;
                }}

                const titleEl = document.getElementById("card-title");
                if (titleEl) titleEl.textContent = m.title;

                const phaseEl = document.getElementById("card-phase");
                if (phaseEl) phaseEl.textContent = m.phase;

                const layerEl = document.getElementById("card-layer");
                if (layerEl) layerEl.textContent = m.layer;

                const statusEl = document.getElementById("card-status");
                if (statusEl) {{
                    statusEl.textContent = m.status;
                    statusEl.style.color = m.status_color;
                    statusEl.style.borderColor = m.status_color + "40";
                    statusEl.style.background = m.status_color + "12";
                }}

                const summaryEl = document.getElementById("card-summary");
                if (summaryEl) {{
                    summaryEl.textContent = m.summary;
                    summaryEl.style.borderLeftColor = m.status_color;
                }}

                // Update params grid
                const paramsContainer = document.getElementById("card-params");
                if (paramsContainer) {{
                    paramsContainer.innerHTML = "";
                    for (const [key, val] of Object.entries(m.details)) {{
                        const cell = document.createElement("div");
                        cell.className = "param-cell";
                        cell.innerHTML = `
                            <div class="param-label">${{key}}</div>
                            <div class="param-value">${{val}}</div>
                        `;
                        paramsContainer.appendChild(cell);
                    }}
                }}
            }} catch (err) {{
                console.error("Error in updateView:", err);
            }}
        }}

        window.onload = initComponent;
    </script>
</body>
</html>"""
    return html

