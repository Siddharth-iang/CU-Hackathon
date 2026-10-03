import React, { useState } from 'react';

interface EventRow {
  timestamp: string;
  decision: 'ALLOW' | 'BLOCK' | 'DETECT' | 'ASK HUMAN';
  tool: string;
  source: string;
  reason: string;
  latency: string;
}

const INITIAL_EVENTS: EventRow[] = [
  { timestamp: "12:42:31.108", decision: "BLOCK", tool: "send_email", source: "vendor_quote_03.pdf", reason: "Rule: Data exfiltration of employee_salaries.csv", latency: "38ms" },
  { timestamp: "12:42:30.942", decision: "DETECT", tool: "hidden_prompt", source: "user_query_rag_retrieval", reason: "Rule: Base64 obfuscated payload in semantic chunk", latency: "22ms" },
  { timestamp: "12:42:29.610", decision: "ALLOW", tool: "read_file", source: "authorized_kb/q3_earnings.txt", reason: "Policy: Read-only scope valid (Tier-1 Access)", latency: "14ms" },
  { timestamp: "12:42:27.184", decision: "ALLOW", tool: "search_web", source: "query \"FX hedge ratios EUR/USD\"", reason: "Policy: Whitelisted API domain via Vertex AI", latency: "19ms" },
  { timestamp: "12:41:55.002", decision: "BLOCK", tool: "execute_shell", source: "tool_output_tamper", reason: "Rule: Unauthorized subprocess (sh -c curl)", latency: "44ms" },
  { timestamp: "12:41:10.884", decision: "ASK HUMAN", tool: "write_database", source: "customer_ticket_409", reason: "Rule: Sensitive column mutation requires approval token", latency: "31ms" },
  { timestamp: "12:40:48.210", decision: "BLOCK", tool: "prompt_eval", source: "incoming_chat_input", reason: "Rule: Jailbreak pattern 'Ignore safety directives'", latency: "18ms" },
  { timestamp: "12:40:22.754", decision: "ALLOW", tool: "calculate_metrics", source: "ledger_sum_agent", reason: "Policy: Sandboxed computation without network I/O", latency: "9ms" },
  { timestamp: "12:40:02.321", decision: "ALLOW", tool: "fetch_document", source: "legal_compliance_v1.docx", reason: "Policy: ACL token validated against Directory-Sync", latency: "16ms" },
  { timestamp: "12:39:41.115", decision: "DETECT", tool: "read_memory", source: "agent_scratchpad_history", reason: "Rule: Cross-session leakage scan flagged proximity", latency: "27ms" },
  { timestamp: "12:39:15.902", decision: "ALLOW", tool: "token_verify", source: "auth_jwt_internal", reason: "Policy: Ephemeral scope cryptographically signed", latency: "11ms" },
];

export const OverviewView: React.FC<{ onNavigateToPlayground: () => void }> = ({ onNavigateToPlayground }) => {
  const [filter, setFilter] = useState<'ALL' | 'ALLOW' | 'BLOCK' | 'DETECT' | 'ASK HUMAN'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = INITIAL_EVENTS.filter((e) => {
    if (filter !== 'ALL' && e.decision !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.tool.toLowerCase().includes(q) ||
        e.source.toLowerCase().includes(q) ||
        e.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getDecisionBadge = (decision: EventRow['decision']) => {
    switch (decision) {
      case 'ALLOW':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm font-mono font-semibold text-[11px] bg-status-safe/10 border border-status-safe/30 text-status-safe uppercase tracking-wide">
            <span>✓</span> ALLOW
          </span>
        );
      case 'BLOCK':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm font-mono font-semibold text-[11px] bg-status-critical/10 border border-status-critical/30 text-status-critical uppercase tracking-wide">
            <span>✗</span> BLOCK
          </span>
        );
      case 'DETECT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm font-mono font-semibold text-[11px] bg-status-warning/10 border border-status-warning/30 text-status-warning uppercase tracking-wide">
            <span>!</span> DETECT
          </span>
        );
      case 'ASK HUMAN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm font-mono font-semibold text-[11px] bg-status-info/10 border border-status-info/30 text-status-info uppercase tracking-wide">
            <span>?</span> ASK HUMAN
          </span>
        );
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex flex-col w-full gap-space-lg select-none">
        {/* Top View Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-xs">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-sm">
              <h1 className="font-headline-xl text-headline-xl text-text-primary tracking-tight">
                Security Overview
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-secondary border border-border-strong text-text-secondary font-label-sm text-label-sm font-mono uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-status-safe animate-pulse"></span>
                ACTIVE MONITOR
              </span>
            </div>
            <p className="font-body-md text-body-md text-text-secondary mt-1">
              Real-time protection status for the active agent session{' '}
              <span className="font-label-md text-label-md text-text-primary font-mono bg-surface-secondary px-1.5 py-0.5 rounded border border-border-subtle">
                SES-8F31A2
              </span>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-space-xs">
            <div className="inline-flex items-center p-0.5 rounded-sm bg-surface-primary border border-border-subtle">
              <button className="px-2.5 py-1 text-label-sm font-label-sm font-mono rounded-sm text-text-muted hover:text-text-primary transition-colors" type="button">
                Last 1 Hour
              </button>
              <button className="px-2.5 py-1 text-label-sm font-label-sm font-mono rounded-sm text-text-muted hover:text-text-primary transition-colors" type="button">
                Last 24 Hours
              </button>
              <button className="px-2.5 py-1 text-label-sm font-label-sm font-mono rounded-sm bg-surface-elevated text-text-primary border border-border-strong font-medium flex items-center gap-1.5" type="button">
                <span className="w-1.5 h-1.5 rounded-sm bg-status-safe"></span>
                Live Stream
              </button>
            </div>

            <div className="h-4 w-px bg-border-subtle mx-1 hidden sm:block"></div>

            <button
              onClick={onNavigateToPlayground}
              className="h-8 px-3 bg-surface-secondary hover:bg-surface-elevated text-text-primary border border-border-subtle hover:border-border-strong rounded text-label-md font-label-md font-mono transition-colors flex items-center gap-1.5"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px] text-status-warning">bug_report</span>
              <span>Simulate Attack</span>
            </button>

            <button
              onClick={() => alert("Downloading security report PDF...")}
              className="h-8 px-3 bg-text-primary hover:bg-[#E2E6EB] text-surface-base rounded text-label-md font-label-md font-medium transition-colors flex items-center gap-1.5 shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">file_download</span>
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* Primary Security Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 bg-surface-primary border border-border-subtle rounded divide-y sm:divide-y-0 sm:divide-x divide-border-subtle overflow-hidden">
          {/* Card 1 */}
          <div className="p-space-md flex flex-col justify-between hover:bg-surface-secondary/40 transition-colors">
            <div className="flex items-center justify-between text-text-muted">
              <span className="font-label-sm text-[11px] uppercase tracking-wider font-mono text-text-muted">Attacks Blocked</span>
              <span className="w-1.5 h-1.5 rounded-sm bg-status-critical"></span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-headline-lg text-headline-lg font-mono text-status-critical tracking-tight">142</span>
              <span className="font-label-sm text-[11px] font-mono text-status-critical bg-status-critical/10 px-1.5 py-0.5 rounded-sm border border-status-critical/30">+12 last hr</span>
            </div>
            <div className="mt-2 text-text-muted font-body-sm text-[12px] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-status-critical">shield_with_heart</span>
              <span className="truncate">Prompt injection & exfil stopped</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-space-md flex flex-col justify-between hover:bg-surface-secondary/40 transition-colors">
            <div className="flex items-center justify-between text-text-muted">
              <span className="font-label-sm text-[11px] uppercase tracking-wider font-mono text-text-muted">Actions Guarded</span>
              <span className="w-1.5 h-1.5 rounded-sm bg-status-safe"></span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-headline-lg text-headline-lg font-mono text-text-primary tracking-tight">3,891</span>
              <span className="font-label-sm text-[11px] font-mono text-status-safe bg-status-safe/10 px-1.5 py-0.5 rounded-sm border border-status-safe/30">99.4% safe</span>
            </div>
            <div className="mt-2 text-text-muted font-body-sm text-[12px] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-status-safe">check_circle</span>
              <span className="truncate">Tool schema & context checked</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-space-md flex flex-col justify-between hover:bg-surface-secondary/40 transition-colors">
            <div className="flex items-center justify-between text-text-muted">
              <span className="font-label-sm text-[11px] uppercase tracking-wider font-mono text-text-muted">Benign Tasks</span>
              <span className="w-1.5 h-1.5 rounded-sm bg-status-info"></span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-headline-lg text-headline-lg font-mono text-text-primary tracking-tight">3,714</span>
              <span className="font-label-sm text-[11px] font-mono text-status-info bg-status-info/10 px-1.5 py-0.5 rounded-sm border border-status-info/30">Normal flow</span>
            </div>
            <div className="mt-2 text-text-muted font-body-sm text-[12px] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-status-info">sync_alt</span>
              <span className="truncate">Zero friction passthrough</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-space-md flex flex-col justify-between hover:bg-surface-secondary/40 transition-colors">
            <div className="flex items-center justify-between text-text-muted">
              <span className="font-label-sm text-[11px] uppercase tracking-wider font-mono text-text-muted">False Positive Rate</span>
              <span className="w-1.5 h-1.5 rounded-sm bg-status-safe"></span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-headline-lg text-headline-lg font-mono text-text-primary tracking-tight">0.08%</span>
              <span className="font-label-sm text-[11px] font-mono text-text-muted">target &lt; 0.20%</span>
            </div>
            <div className="mt-2 text-text-muted font-body-sm text-[12px] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-status-safe">verified_user</span>
              <span className="truncate">Operator override delta: 0</span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="p-space-md flex flex-col justify-between hover:bg-surface-secondary/40 transition-colors">
            <div className="flex items-center justify-between text-text-muted">
              <span className="font-label-sm text-[11px] uppercase tracking-wider font-mono text-text-muted">Avg Interception</span>
              <span className="w-1.5 h-1.5 rounded-sm bg-primary-container"></span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-headline-lg text-headline-lg font-mono text-primary tracking-tight">42ms</span>
              <span className="font-label-sm text-[11px] font-mono text-text-secondary">P99: 118ms</span>
            </div>
            <div className="mt-2 text-text-muted font-body-sm text-[12px] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-text-secondary">speed</span>
              <span className="truncate">Inline L7 proxy budget: 60ms</span>
            </div>
          </div>
        </div>

        {/* Operational Core (8 cols / 4 cols) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* LEFT COLUMN: Real-Time Stream Engine */}
          <section className="xl:col-span-8 flex flex-col bg-surface-primary border border-border-subtle rounded-md overflow-hidden">
            <div className="px-space-md py-3 border-b border-border-subtle flex flex-wrap items-center justify-between gap-space-sm bg-surface-primary">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-status-safe animate-pulse"></div>
                <span className="font-label-md text-label-md uppercase tracking-wider text-text-primary font-mono">
                  Live Security Activity Stream
                </span>
                <span className="font-label-sm text-label-sm text-status-safe font-mono bg-status-safe/10 px-2 py-0.5 rounded border border-status-safe/20">
                  INTERCEPTING
                </span>
              </div>
              <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-text-muted font-mono">
                <span className="material-symbols-outlined text-[14px]">tune</span>
                <span>Buffer: 2,000 evt/s max</span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="px-space-md py-2.5 bg-surface-secondary border-b border-border-subtle flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-1">
                <span className="font-label-sm text-label-sm uppercase text-text-muted mr-1 font-mono">Filter:</span>
                {(['ALL', 'ALLOW', 'BLOCK', 'DETECT', 'ASK HUMAN'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFilter(opt)}
                    className={`h-6 px-2 text-label-sm font-label-sm rounded-sm font-mono uppercase tracking-wider inline-flex items-center justify-center whitespace-nowrap transition-colors ${
                      filter === opt
                        ? 'bg-surface-elevated text-text-primary border border-border-strong font-medium'
                        : 'border border-border-subtle/60 text-text-secondary hover:bg-surface-primary'
                    }`}
                  >
                    {opt === 'ALLOW' && <span className="text-[11px] font-semibold mr-1 text-status-safe">✓</span>}
                    {opt === 'BLOCK' && <span className="text-[11px] font-semibold mr-1 text-status-critical">✗</span>}
                    {opt === 'DETECT' && <span className="text-[11px] font-semibold mr-1 text-status-warning">!</span>}
                    {opt === 'ASK HUMAN' && <span className="text-[11px] font-semibold mr-1 text-status-info">?</span>}
                    {opt}
                  </button>
                ))}
              </div>

              <div className="relative flex items-center min-w-[220px]">
                <span className="material-symbols-outlined absolute left-2 text-[14px] text-text-muted">search</span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-7 pl-7 pr-2.5 bg-surface-primary border border-border-subtle focus:border-primary text-body-sm font-mono text-text-primary placeholder:text-text-muted rounded outline-none transition-colors"
                  placeholder="Search tool, source, signature..."
                  type="text"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border-strong bg-surface-primary text-text-muted font-label-sm text-label-sm font-mono uppercase select-none">
                    <th className="py-2 px-space-md font-medium w-24">Timestamp</th>
                    <th className="py-2 px-space-sm font-medium w-32">Decision</th>
                    <th className="py-2 px-space-sm font-medium w-36">Tool / Type</th>
                    <th className="py-2 px-space-sm font-medium">Source / Target Context</th>
                    <th className="py-2 px-space-sm font-medium">Reason / Policy</th>
                    <th className="py-2 px-space-md font-medium text-right w-20">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-code-block text-code-block text-text-secondary">
                  {filteredEvents.map((evt, idx) => (
                    <tr key={idx} className="hover:bg-surface-secondary/70 transition-colors group">
                      <td className="py-2 px-space-md text-text-muted font-mono whitespace-nowrap text-[12px]">{evt.timestamp}</td>
                      <td className="py-2 px-space-sm whitespace-nowrap">{getDecisionBadge(evt.decision)}</td>
                      <td className="py-2 px-space-sm text-text-primary font-mono whitespace-nowrap text-[12px]">{evt.tool}</td>
                      <td className="py-2 px-space-sm min-w-0 font-mono text-[11px] text-text-secondary truncate">{evt.source}</td>
                      <td className={`py-2 px-space-sm min-w-0 font-mono text-[11px] truncate ${evt.decision === 'BLOCK' ? 'text-status-critical' : evt.decision === 'DETECT' ? 'text-status-warning' : 'text-text-muted'}`}>
                        {evt.reason}
                      </td>
                      <td className={`py-2 px-space-md text-right font-mono whitespace-nowrap text-[12px] ${evt.decision === 'ALLOW' ? 'text-status-safe' : 'text-text-secondary'}`}>
                        {evt.latency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-space-md py-2 border-t border-border-subtle bg-surface-secondary flex flex-wrap items-center justify-between text-label-sm font-label-sm text-text-muted font-mono">
              <div className="flex items-center gap-2">
                <span className="text-text-secondary text-[11px]">Showing {filteredEvents.length} intercepted events</span>
                <span className="text-border-strong">•</span>
                <span className="text-status-safe text-[11px]">Auto-refresh active (500ms)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-text-secondary text-[11px]">Page 1 / 1</span>
              </div>
            </div>
          </section>

          {/* RIGHT PANEL: Threat Telemetry & Guardrails */}
          <aside className="xl:col-span-4 flex flex-col gap-space-md">
            {/* Defense Matrix */}
            <div className="bg-surface-primary border border-border-subtle rounded p-space-md flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  <h2 className="font-headline-sm text-headline-sm text-text-primary">Firewall Defense Matrix</h2>
                </div>
                <span className="font-label-sm text-label-sm text-text-muted font-mono uppercase">L7 INLINE</span>
              </div>

              <div className="flex flex-col gap-2 pt-0.5">
                <div className="flex items-center justify-between p-2 rounded-sm bg-surface-secondary border border-border-subtle">
                  <div className="flex flex-col">
                    <span className="font-body-md text-body-md text-text-primary font-medium">Content Firewall</span>
                    <span className="font-label-sm text-label-sm text-text-muted font-mono">100% inspected (Semantic L3)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-sm bg-status-safe/10 border border-status-safe/30 text-status-safe font-label-sm text-label-sm font-mono font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 whitespace-nowrap">
                    <span>●</span> ACTIVE
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-sm bg-surface-secondary border border-border-subtle">
                  <div className="flex flex-col">
                    <span className="font-body-md text-body-md text-text-primary font-medium">Action Guard</span>
                    <span className="font-label-sm text-label-sm text-text-muted font-mono">Policy Set: Tier-1-Financial</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-sm bg-primary-container/10 border border-primary-container/30 text-primary font-label-sm text-label-sm font-mono font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 whitespace-nowrap">
                    <span>■</span> ENFORCING
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-sm bg-surface-secondary border border-border-subtle">
                  <div className="flex flex-col">
                    <span className="font-body-md text-body-md text-text-primary font-medium">Taint Tracking</span>
                    <span className="font-label-sm text-label-sm text-text-muted font-mono">Provenance Graph alive</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-sm bg-status-safe/10 border border-status-safe/30 text-status-safe font-label-sm text-label-sm font-mono font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 whitespace-nowrap">
                    <span>●</span> SYNCHRONIZED
                  </span>
                </div>
              </div>
            </div>

            {/* Threat Distribution */}
            <div className="bg-surface-primary border border-border-subtle rounded p-space-md flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-status-critical text-[18px]">pie_chart</span>
                  <h2 className="font-headline-sm text-headline-sm text-text-primary">Threat Distribution</h2>
                </div>
                <span className="font-label-sm text-label-sm font-mono text-text-muted">142 TOTAL BLOCKS</span>
              </div>

              <div className="flex flex-col gap-3 pt-0.5">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-body-sm font-body-sm">
                    <span className="text-text-primary font-medium">Prompt Injection</span>
                    <span className="text-text-secondary font-mono text-label-sm">48% (68 events)</span>
                  </div>
                  <div className="w-full h-1 bg-surface-secondary rounded-none overflow-hidden">
                    <div className="bg-status-critical h-full" style={{ width: '48%' }}></div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-body-sm font-body-sm">
                    <span className="text-text-primary font-medium">Data Exfiltration</span>
                    <span className="text-text-secondary font-mono text-label-sm">32% (45 events)</span>
                  </div>
                  <div className="w-full h-1 bg-surface-secondary rounded-none overflow-hidden">
                    <div className="bg-status-warning h-full" style={{ width: '32%' }}></div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-body-sm font-body-sm">
                    <span className="text-text-primary font-medium">Unauthorized Tool Call</span>
                    <span className="text-text-secondary font-mono text-label-sm">14% (20 events)</span>
                  </div>
                  <div className="w-full h-1 bg-surface-secondary rounded-none overflow-hidden">
                    <div className="bg-status-info h-full" style={{ width: '14%' }}></div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-body-sm font-body-sm">
                    <span className="text-text-primary font-medium">Privilege Escalation</span>
                    <span className="text-text-secondary font-mono text-label-sm">6% (9 events)</span>
                  </div>
                  <div className="w-full h-1 bg-surface-secondary rounded-none overflow-hidden">
                    <div className="bg-primary-container h-full" style={{ width: '6%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Guardrails */}
            <div className="bg-surface-primary border border-border-subtle rounded p-space-md flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-text-secondary text-[18px]">rule_settings</span>
                  <h2 className="font-headline-sm text-headline-sm text-text-primary">Session Guardrails</h2>
                </div>
                <span className="font-label-sm text-label-sm font-mono text-status-safe uppercase font-semibold">
                  🔒 LOCKED
                </span>
              </div>

              <div className="flex flex-col gap-2.5 pt-0.5">
                <div className="flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm uppercase font-mono text-text-muted">Authorized Tools</span>
                  <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded-sm bg-surface-secondary border border-border-subtle text-status-safe">read_file</span>
                    <span className="px-2 py-0.5 rounded-sm bg-surface-secondary border border-border-subtle text-status-safe">search_web</span>
                    <span className="px-2 py-0.5 rounded-sm bg-surface-secondary border border-border-subtle text-status-safe">calculate_metrics</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <span className="font-label-sm text-label-sm uppercase font-mono text-text-muted">Restricted Tools</span>
                  <div className="flex flex-col gap-1 font-mono text-[11px]">
                    <div className="flex items-center justify-between px-2 py-1 rounded-sm bg-surface-secondary border border-border-subtle">
                      <span className="text-text-primary font-mono text-[11px]">send_email</span>
                      <span className="text-status-warning font-mono text-[10px] uppercase font-semibold bg-status-warning/10 px-1.5 py-0.5 rounded-sm border border-status-warning/30 inline-flex items-center gap-1 whitespace-nowrap">
                        <span>⚠</span> REQUIRES HITL
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-2 py-1 rounded-sm bg-surface-secondary border border-border-subtle">
                      <span className="text-text-primary font-mono text-[11px]">execute_shell</span>
                      <span className="text-status-critical font-mono text-[10px] uppercase font-semibold bg-status-critical/10 px-1.5 py-0.5 rounded-sm border border-status-critical/30 inline-flex items-center gap-1 whitespace-nowrap">
                        <span>⛔</span> FORBIDDEN
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <span className="font-label-sm text-label-sm uppercase font-mono text-text-muted">Outbound Domain Allowlist</span>
                  <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                    <span className="px-2 py-0.5 rounded-sm bg-surface-secondary border border-border-subtle text-text-secondary">internal-rag.corp</span>
                    <span className="px-2 py-0.5 rounded-sm bg-surface-secondary border border-border-subtle text-text-secondary">sec-docs.local</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
