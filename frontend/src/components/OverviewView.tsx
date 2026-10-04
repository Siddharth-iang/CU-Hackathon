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
  { timestamp: "12:42:31", decision: "BLOCK", tool: "send_email", source: "vendor_quote_03.pdf", reason: "Data exfiltration: employee_salaries.csv to external domain", latency: "38ms" },
  { timestamp: "12:42:30", decision: "DETECT", tool: "hidden_prompt", source: "user_query_rag_retrieval", reason: "Base64 obfuscated payload detected in semantic chunk", latency: "22ms" },
  { timestamp: "12:42:29", decision: "ALLOW", tool: "read_file", source: "authorized_kb/q3_earnings.txt", reason: "Read-only scope valid within Tier-1 RBAC boundary", latency: "14ms" },
  { timestamp: "12:42:27", decision: "ALLOW", tool: "search_web", source: "query 'FX hedge ratios EUR/USD'", reason: "Whitelisted API endpoint via enterprise proxy", latency: "19ms" },
  { timestamp: "12:41:55", decision: "BLOCK", tool: "execute_shell", source: "tool_output_tamper", reason: "Unauthorized subprocess execution attempted (sh -c curl)", latency: "44ms" },
  { timestamp: "12:41:10", decision: "ASK HUMAN", tool: "write_database", source: "customer_ticket_409", reason: "Sensitive column mutation requires Tier-2 human sign-off", latency: "31ms" },
  { timestamp: "12:40:48", decision: "BLOCK", tool: "prompt_eval", source: "incoming_chat_input", reason: "Jailbreak signature 'Ignore previous directives' blocked", latency: "18ms" },
  { timestamp: "12:40:22", decision: "ALLOW", tool: "calculate_metrics", source: "ledger_sum_agent", reason: "Sandboxed arithmetic computation without network I/O", latency: "9ms" },
  { timestamp: "12:40:02", decision: "ALLOW", tool: "fetch_document", source: "legal_compliance_v1.docx", reason: "Directory ACL token validated against security group", latency: "16ms" },
  { timestamp: "12:39:41", decision: "DETECT", tool: "read_memory", source: "agent_scratchpad_history", reason: "Cross-session memory leakage scan flagged high proximity", latency: "27ms" },
  { timestamp: "12:39:15", decision: "ALLOW", tool: "token_verify", source: "auth_jwt_internal", reason: "Ephemeral token verified with valid cryptographic signature", latency: "11ms" },
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-status-safe/10 text-status-safe border border-status-safe/30">
            <span className="material-symbols-outlined text-[13px]">check</span> ALLOW
          </span>
        );
      case 'BLOCK':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-status-critical/10 text-status-critical border border-status-critical/30">
            <span className="material-symbols-outlined text-[13px]">close</span> BLOCK
          </span>
        );
      case 'DETECT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-status-warning/10 text-status-warning border border-status-warning/30">
            <span className="material-symbols-outlined text-[13px]">warning</span> DETECT
          </span>
        );
      case 'ASK HUMAN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-status-info/10 text-status-info border border-status-info/30">
            <span className="material-symbols-outlined text-[13px]">help</span> ASK HUMAN
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 lg:p-8 select-none font-sans text-text-primary">
      <div className="flex flex-col gap-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-subtle gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                Security Overview
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-status-safe/10 border border-status-safe/30 text-status-safe text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-status-safe animate-pulse"></span>
                ACTIVE MONITOR
              </span>
            </div>
            <p className="text-sm text-text-secondary mt-1">
              Real-time protection telemetry for active agent session.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToPlayground}
              className="h-9 px-4 bg-surface hover:bg-surface-secondary text-text-primary border border-border-subtle hover:border-border-strong rounded-md text-xs font-medium transition-colors flex items-center gap-2"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-status-warning">bug_report</span>
              <span>Simulate Attack</span>
            </button>

            <button
              onClick={() => alert("Downloading executive security report PDF...")}
              className="h-9 px-4 bg-text-primary hover:opacity-90 text-canvas rounded-md text-xs font-semibold transition-opacity flex items-center gap-2 shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* 1. TOP METRIC ROW (Prioritized: Protection Status, Attacks Blocked, Actions Guarded, Benign Tasks) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Protection Status */}
          <div className="p-5 rounded-xl bg-surface border border-border-subtle shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-muted">Protection Status</span>
              <span className="w-2 h-2 rounded-full bg-status-safe animate-pulse"></span>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-status-safe tracking-tight">Active & Enforcing</div>
              <div className="text-xs text-text-muted mt-0.5">Policy Engine v2.4.1 • 100% Uptime</div>
            </div>
            <div className="text-xs text-text-secondary flex items-center gap-1.5 pt-2 border-t border-border-subtle">
              <span className="material-symbols-outlined text-[15px] text-status-safe">verified</span>
              <span>All 2 Defense Layers Active</span>
            </div>
          </div>

          {/* Card 2: Attacks Blocked */}
          <div className="p-5 rounded-xl bg-surface border border-border-subtle shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-muted">Attacks Blocked</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-status-critical/10 text-status-critical border border-status-critical/30">
                +12 last hr
              </span>
            </div>
            <div className="my-2">
              <div className="text-3xl font-bold text-status-critical tracking-tight">142</div>
              <div className="text-xs text-text-muted mt-0.5">Prompt Injections & Exfil Severed</div>
            </div>
            <div className="text-xs text-text-secondary flex items-center gap-1.5 pt-2 border-t border-border-subtle">
              <span className="material-symbols-outlined text-[15px] text-status-critical">shield</span>
              <span>Zero sensitive assets leaked</span>
            </div>
          </div>

          {/* Card 3: Actions Guarded */}
          <div className="p-5 rounded-xl bg-surface border border-border-subtle shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-muted">Actions Guarded</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-status-safe/10 text-status-safe border border-status-safe/30">
                99.4% safe
              </span>
            </div>
            <div className="my-2">
              <div className="text-3xl font-bold text-text-primary tracking-tight">3,891</div>
              <div className="text-xs text-text-muted mt-0.5">Tool Dispatches Validated Pre-Flight</div>
            </div>
            <div className="text-xs text-text-secondary flex items-center gap-1.5 pt-2 border-t border-border-subtle">
              <span className="material-symbols-outlined text-[15px] text-status-safe">check_circle</span>
              <span>Avg Interception Latency: 18ms</span>
            </div>
          </div>

          {/* Card 4: Benign Tasks */}
          <div className="p-5 rounded-xl bg-surface border border-border-subtle shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-muted">Benign Tasks</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-status-info/10 text-status-info border border-status-info/30">
                Normal flow
              </span>
            </div>
            <div className="my-2">
              <div className="text-3xl font-bold text-text-primary tracking-tight">3,714</div>
              <div className="text-xs text-text-muted mt-0.5">Zero Friction Business Operations</div>
            </div>
            <div className="text-xs text-text-secondary flex items-center gap-1.5 pt-2 border-t border-border-subtle">
              <span className="material-symbols-outlined text-[15px] text-status-info">sync_alt</span>
              <span>Low False Positive Rate: 0.08%</span>
            </div>
          </div>
        </div>

        {/* 2. MAIN VISUAL ELEMENT: Live Security Activity Stream */}
        <section className="bg-surface border border-border-subtle rounded-xl shadow-sm overflow-hidden flex flex-col">
          {/* Stream Header & Controls */}
          <div className="p-5 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-status-safe animate-pulse"></div>
              <div>
                <h3 className="text-base font-semibold text-text-primary">
                  Live Security Activity Stream
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  High-throughput event interceptor • Continuous real-time telemetry
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Filter Pills */}
              <div className="flex items-center p-1 rounded-lg bg-surface-secondary border border-border-subtle">
                {(['ALL', 'BLOCK', 'ALLOW', 'DETECT', 'ASK HUMAN'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFilter(opt)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      filter === opt
                        ? 'bg-surface text-text-primary shadow-sm font-semibold'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative min-w-[200px]">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-text-muted">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 bg-surface-secondary border border-border-subtle focus:border-primary text-xs rounded-md outline-none text-text-primary placeholder:text-text-muted transition-colors"
                  placeholder="Filter events..."
                  type="text"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-secondary/50 text-text-muted text-xs font-medium">
                  <th className="py-3 px-5 w-24">Timestamp</th>
                  <th className="py-3 px-4 w-32">Decision</th>
                  <th className="py-3 px-4 w-40">Tool / Target</th>
                  <th className="py-3 px-4">Source / Context</th>
                  <th className="py-3 px-4">Reason / Policy</th>
                  <th className="py-3 px-5 text-right w-24">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-xs">
                {filteredEvents.map((evt, idx) => (
                  <tr key={idx} className="hover:bg-surface-secondary/60 transition-colors">
                    <td className="py-3 px-5 font-mono text-text-muted whitespace-nowrap">
                      {evt.timestamp}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getDecisionBadge(evt.decision)}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-text-primary whitespace-nowrap">
                      {evt.tool}()
                    </td>
                    <td className="py-3 px-4 font-mono text-text-secondary max-w-xs truncate">
                      {evt.source}
                    </td>
                    <td className="py-3 px-4 text-text-secondary max-w-md truncate">
                      {evt.reason}
                    </td>
                    <td className="py-3 px-5 font-mono text-right text-text-muted whitespace-nowrap">
                      {evt.latency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border-subtle bg-surface-secondary/40 flex items-center justify-between text-xs text-text-muted">
            <span>Showing {filteredEvents.length} intercepted events</span>
            <span className="flex items-center gap-1.5 text-status-safe font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-status-safe"></span>
              Live stream connected
            </span>
          </div>
        </section>

        {/* 3. SECONDARY PANELS: Threat Distribution & Firewall Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Threat Distribution */}
          <div className="p-6 rounded-xl bg-surface border border-border-subtle shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-text-primary">
                Threat Vector Distribution
              </h4>
              <span className="text-xs text-text-muted">Last 24 Hours</span>
            </div>

            <div className="space-y-3">
              {[
                { name: "Indirect RAG Injection", pct: 48, count: 68, color: "bg-status-critical" },
                { name: "Role Delimiter Hijack (<|im_start|>)", pct: 26, count: 37, color: "bg-status-warning" },
                { name: "Encoded Payloads (Base64 / Hex)", pct: 18, count: 26, color: "bg-primary" },
                { name: "Tool Redirect / Exfiltration", pct: 8, count: 11, color: "bg-status-safe" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-secondary">{item.name}</span>
                    <span className="font-semibold text-text-primary">{item.count} ({item.pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Defense Guardrails Matrix */}
          <div className="p-6 rounded-xl bg-surface border border-border-subtle shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-text-primary">
                Firewall Defense Matrix
              </h4>
              <span className="text-xs text-status-safe font-medium">All Systems Nominal</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-surface-secondary border border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px] text-status-safe">filter_alt</span>
                  <div>
                    <div className="text-xs font-semibold text-text-primary">Layer 1: Content Firewall</div>
                    <div className="text-[11px] text-text-muted">Regex heuristics, Base64/Hex decoders</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-status-safe/10 text-status-safe border border-status-safe/30">
                  BLOCKING
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface-secondary border border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px] text-status-safe">gavel</span>
                  <div>
                    <div className="text-xs font-semibold text-text-primary">Layer 2: Action Guard Pre-Flight Gate</div>
                    <div className="text-[11px] text-text-muted">RBAC scopes, recipient allowlists, socket kill</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-status-safe/10 text-status-safe border border-status-safe/30">
                  ENFORCING
                </span>
              </div>

              <div className="p-3 rounded-lg bg-surface-secondary border border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
                  <div>
                    <div className="text-xs font-semibold text-text-primary">Cryptographic Audit Ledger</div>
                    <div className="text-[11px] text-text-muted">SHA-256 chunk hashes, RSA-4096 tamper seals</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary/10 text-primary border border-primary/30">
                  SEALED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
