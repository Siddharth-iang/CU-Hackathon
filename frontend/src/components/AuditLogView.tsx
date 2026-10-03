import React, { useState } from 'react';

interface AuditRecord {
  id: string;
  timestamp: string;
  decision: 'BLOCK' | 'ALLOW' | 'DETECT' | 'ASK HUMAN';
  tool: string;
  source: string;
  reason: string;
  rule: string;
  risk: string;
  latency: string;
  sha: string;
}

const AUDIT_RECORDS: AuditRecord[] = [
  { id: "EVT-8941", timestamp: "2026-10-03 13:00:09", decision: "BLOCK", tool: "send_email", source: "vendor_quote_03.pdf", reason: "Data exfiltration of employee_salaries.csv to untrusted external domain", rule: "SEC-RULE-402 (External Exfiltration)", risk: "CRITICAL 9.8", latency: "18.2ms", sha: "7f83b1657ff18b48" },
  { id: "EVT-8940", timestamp: "2026-10-03 12:59:45", decision: "DETECT", tool: "hidden_prompt", source: "logistics_bid.txt", reason: "Base64 obfuscated payload detected inside comment delimiters", rule: "SEC-RULE-104 (Base64 Ingestion)", risk: "HIGH 7.4", latency: "31.0ms", sha: "a1b2c3d4e5f60718" },
  { id: "EVT-8939", timestamp: "2026-10-03 12:58:12", decision: "BLOCK", tool: "write_record", source: "server_agreement.md", reason: "Attempted mutation of audit logging table without elevated credential token", rule: "SEC-RULE-301 (Audit Tamper)", risk: "CRITICAL 9.2", latency: "24.5ms", sha: "8899aabbccddeeff" },
  { id: "EVT-8938", timestamp: "2026-10-03 12:56:30", decision: "ALLOW", tool: "read_file", source: "authorized_kb/spec.pdf", reason: "Read-only access validated within internal scope permissions", rule: "POL-001 (Internal Read Scope)", risk: "LOW 0.0", latency: "12.1ms", sha: "1122334455667788" },
  { id: "EVT-8937", timestamp: "2026-10-03 12:55:04", decision: "ALLOW", tool: "search_web", source: "query 'cisco 9300 pricing'", reason: "Egress domain on verified corporate proxy allowlist", rule: "POL-004 (Whitelisted API Egress)", risk: "LOW 0.0", latency: "19.4ms", sha: "9988776655443322" },
  { id: "EVT-8936", timestamp: "2026-10-03 12:53:19", decision: "ASK HUMAN", tool: "send_email", source: "procurement_bid.pdf", reason: "Recipient domain ambiguity detected; routed to human approval queue", rule: "SEC-RULE-202 (External Ambiguity)", risk: "MEDIUM 5.2", latency: "35.8ms", sha: "4455667788990011" },
  { id: "EVT-8935", timestamp: "2026-10-03 12:51:50", decision: "BLOCK", tool: "read_file", source: "data/confidential/customer_pii.json", reason: "Agent attempted unauthorized read on PII asset exceeding RBAC tier", rule: "SEC-RULE-401 (RBAC Boundary Violation)", risk: "CRITICAL 9.5", latency: "15.0ms", sha: "7766554433221100" },
];

export const AuditLogView: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(AUDIT_RECORDS[0]);
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  const filtered = AUDIT_RECORDS.filter((r) => {
    if (filter !== "ALL" && r.decision !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.tool.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-6 lg:p-8 select-none font-sans text-text-primary">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border-subtle gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Security Audit Log
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Immutable forensic ledger of all intercepted model tool dispatches and firewall decisions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("Downloading full forensic audit bundle JSON...")}
              className="h-9 px-4 bg-surface hover:bg-surface-secondary text-text-primary border border-border-subtle hover:border-border-strong rounded-md text-xs font-medium transition-colors flex items-center gap-2"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export Audit Bundle</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center p-1 rounded-lg bg-surface-secondary border border-border-subtle overflow-x-auto">
            {['ALL', 'BLOCK', 'ALLOW', 'DETECT', 'ASK HUMAN'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  filter === f
                    ? 'bg-surface text-text-primary shadow-sm font-semibold'
                    : 'text-text-muted hover:text-text-primary'
                }`}
                type="button"
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-text-muted">
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit records..."
              className="w-full h-8 pl-8 pr-3 bg-surface-secondary border border-border-subtle focus:border-primary text-xs rounded-md outline-none text-text-primary placeholder:text-text-muted transition-colors"
              type="text"
            />
          </div>
        </div>

        {/* Table & Inspector Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 5-Column Primary Table (8 cols when drawer open, 12 cols when closed) */}
          <div className={`${selectedRecord ? 'lg:col-span-8' : 'lg:col-span-12'} bg-surface border border-border-subtle rounded-xl shadow-sm overflow-hidden transition-all duration-200`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle bg-surface-secondary/50 text-text-muted text-xs font-medium">
                    <th className="py-3 px-4 w-36">Timestamp</th>
                    <th className="py-3 px-3 w-28">Decision</th>
                    <th className="py-3 px-4 w-36">Tool</th>
                    <th className="py-3 px-4 w-44">Source</th>
                    <th className="py-3 px-4">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-xs">
                  {filtered.map((r) => {
                    const isSelected = selectedRecord?.id === r.id;
                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedRecord(r)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-primary/5 hover:bg-primary/10'
                            : 'hover:bg-surface-secondary/60'
                        }`}
                      >
                        <td className="py-3 px-4 font-mono text-text-muted whitespace-nowrap">
                          {r.timestamp}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                              r.decision === 'BLOCK'
                                ? 'bg-status-critical/10 text-status-critical border border-status-critical/30'
                                : r.decision === 'ALLOW'
                                ? 'bg-status-safe/10 text-status-safe border border-status-safe/30'
                                : r.decision === 'DETECT'
                                ? 'bg-status-warning/10 text-status-warning border border-status-warning/30'
                                : 'bg-status-info/10 text-status-info border border-status-info/30'
                            }`}
                          >
                            {r.decision}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-text-primary whitespace-nowrap">
                          {r.tool}()
                        </td>
                        <td className="py-3 px-4 font-mono text-text-secondary truncate max-w-[160px]">
                          {r.source}
                        </td>
                        <td className="py-3 px-4 text-text-secondary truncate max-w-xs">
                          {r.reason}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-border-subtle bg-surface-secondary/40 flex items-center justify-between text-xs text-text-muted">
              <span>{filtered.length} records in forensic ledger</span>
              <span>Click any record to inspect forensic evidence</span>
            </div>
          </div>

          {/* Right-Side Evidence Inspector Drawer */}
          {selectedRecord && (
            <div className="lg:col-span-4 bg-surface border border-border-subtle rounded-xl p-5 shadow-sm flex flex-col gap-4 sticky top-[68px]">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">manage_search</span>
                  <span className="font-semibold text-sm text-text-primary">
                    Event Evidence Inspector
                  </span>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-6 h-6 rounded-md hover:bg-surface-secondary text-text-muted hover:text-text-primary flex items-center justify-center transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-surface-secondary border border-border-subtle flex items-center justify-between">
                  <span className="text-xs text-text-muted">Event ID:</span>
                  <span className="font-mono text-xs font-bold text-text-primary">
                    {selectedRecord.id}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-surface-secondary border border-border-subtle flex items-center justify-between">
                  <span className="text-xs text-text-muted">Decision:</span>
                  <span
                    className={`font-semibold text-xs ${
                      selectedRecord.decision === 'BLOCK'
                        ? 'text-status-critical'
                        : selectedRecord.decision === 'ALLOW'
                        ? 'text-status-safe'
                        : 'text-status-warning'
                    }`}
                  >
                    {selectedRecord.decision} ({selectedRecord.risk})
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col gap-1">
                  <span className="text-xs text-text-muted">Tool Dispatched:</span>
                  <span className="font-mono text-xs font-semibold text-primary">
                    {selectedRecord.tool}()
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col gap-1">
                  <span className="text-xs text-text-muted">Ingestion Source:</span>
                  <span className="font-mono text-xs text-text-primary break-all">
                    {selectedRecord.source}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col gap-1">
                  <span className="text-xs text-text-muted">Policy Rule:</span>
                  <span className="text-xs font-medium text-text-primary">
                    {selectedRecord.rule}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-surface-secondary border border-border-subtle flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">Cryptographic Proof:</span>
                    <span className="text-[10px] text-status-safe font-semibold">SEALED</span>
                  </div>
                  <span className="font-mono text-[11px] text-primary break-all">
                    SHA256: {selectedRecord.sha}...ec449f82
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-surface-secondary border border-border-subtle flex items-center justify-between text-xs">
                  <span className="text-text-muted">Evaluation Overhead:</span>
                  <span className="font-mono font-semibold text-status-safe">
                    {selectedRecord.latency}
                  </span>
                </div>
              </div>

              <button
                onClick={() => alert(`Downloading raw SARIF forensic packet for ${selectedRecord.id}...`)}
                className="w-full h-8 bg-surface-secondary hover:bg-surface-elevated text-text-primary border border-border-subtle hover:border-border-strong rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-2 mt-1"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">code</span>
                <span>Export Raw SARIF JSON</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
