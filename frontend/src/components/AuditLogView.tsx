import React, { useState } from 'react';

interface AuditRecord {
  id: string;
  timestamp: string;
  decision: 'BLOCK' | 'ALLOW' | 'DETECT' | 'ASK HUMAN';
  tool: string;
  source: string;
  rule: string;
  risk: string;
  latency: string;
  sha: string;
}

const AUDIT_RECORDS: AuditRecord[] = [
  { id: "EVT-8941", timestamp: "2026-10-03 13:00:09", decision: "BLOCK", tool: "send_email", source: "vendor_quote_03.pdf", rule: "SEC-RULE-402 (External Exfiltration)", risk: "CRITICAL 9.8", latency: "18.2ms", sha: "7f83b1657ff18b48" },
  { id: "EVT-8940", timestamp: "2026-10-03 12:59:45", decision: "DETECT", tool: "hidden_prompt", source: "logistics_bid.txt", rule: "SEC-RULE-104 (Base64 Ingestion)", risk: "HIGH 7.4", latency: "31.0ms", sha: "a1b2c3d4e5f60718" },
  { id: "EVT-8939", timestamp: "2026-10-03 12:58:12", decision: "BLOCK", tool: "write_record", source: "server_agreement.md", rule: "SEC-RULE-301 (Audit Tamper)", risk: "CRITICAL 9.2", latency: "24.5ms", sha: "8899aabbccddeeff" },
  { id: "EVT-8938", timestamp: "2026-10-03 12:56:30", decision: "ALLOW", tool: "read_file", source: "authorized_kb/spec.pdf", rule: "POL-001 (Internal Read Scope)", risk: "LOW 0.0", latency: "12.1ms", sha: "1122334455667788" },
  { id: "EVT-8937", timestamp: "2026-10-03 12:55:04", decision: "ALLOW", tool: "search_web", source: "query \"cisco 9300 pricing\"", rule: "POL-004 (Whitelisted API Egress)", risk: "LOW 0.0", latency: "19.4ms", sha: "9988776655443322" },
  { id: "EVT-8936", timestamp: "2026-10-03 12:53:19", decision: "ASK HUMAN", tool: "send_email", source: "procurement_bid.pdf", rule: "SEC-RULE-202 (External Recipient Ambiguity)", risk: "MEDIUM 5.2", latency: "35.8ms", sha: "4455667788990011" },
  { id: "EVT-8935", timestamp: "2026-10-03 12:51:50", decision: "BLOCK", tool: "read_file", source: "data/confidential/customer_pii.json", rule: "SEC-RULE-401 (Confidential RBAC Violation)", risk: "CRITICAL 9.5", latency: "15.0ms", sha: "7766554433221100" },
];

export const AuditLogView: React.FC = () => {
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord>(AUDIT_RECORDS[0]);
  const [filter, setFilter] = useState<string>("ALL");

  const filtered = AUDIT_RECORDS.filter((r) => {
    if (filter === "ALL") return true;
    return r.decision === filter;
  });

  return (
    <div className="w-full p-6 select-none font-sans text-text-primary">
      <div className="flex flex-col w-full gap-space-md">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs border-b border-border-subtle">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-text-primary tracking-tight">
              Security Audit Log
            </h1>
            <p className="font-body-md text-body-md text-text-secondary mt-1">
              Immutable forensic ledger of all intercepted model tool dispatches and content firewall detections.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Downloading full forensic audit bundle JSON...")}
              className="h-8 px-3 bg-surface-secondary hover:bg-surface-elevated text-text-primary border border-border-subtle hover:border-border-strong rounded font-mono text-[11px] transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              <span>Export Audit Bundle</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-[11px]">
          {['ALL', 'BLOCK', 'ALLOW', 'DETECT', 'ASK HUMAN'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-sm border uppercase transition-colors ${
                filter === f
                  ? 'bg-surface-elevated text-text-primary border-border-strong font-semibold'
                  : 'bg-surface-base text-text-muted hover:text-text-primary border-border-subtle'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table & Detail Split */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start">
          {/* Table (8 cols) */}
          <div className="xl:col-span-8 bg-surface-primary border border-border-subtle rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left font-mono text-[11px]">
                <thead>
                  <tr className="border-b border-border-strong bg-surface-primary text-text-muted uppercase">
                    <th className="py-2.5 px-space-md">Event ID</th>
                    <th className="py-2.5 px-space-sm">Timestamp</th>
                    <th className="py-2.5 px-space-sm">Decision</th>
                    <th className="py-2.5 px-space-sm">Tool</th>
                    <th className="py-2.5 px-space-sm">Rule Violated</th>
                    <th className="py-2.5 px-space-sm">Risk</th>
                    <th className="py-2.5 px-space-md text-right">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-text-secondary">
                  {filtered.map((r) => {
                    const isSelected = selectedRecord.id === r.id;
                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedRecord(r)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-surface-secondary/90' : 'hover:bg-surface-secondary/50'
                        }`}
                      >
                        <td className="py-2 px-space-md text-text-primary font-semibold">{r.id}</td>
                        <td className="py-2 px-space-sm text-text-muted">{r.timestamp}</td>
                        <td className="py-2 px-space-sm">
                          <span
                            className={`px-1.5 py-0.5 rounded-sm font-semibold uppercase text-[10px] ${
                              r.decision === 'BLOCK'
                                ? 'bg-status-critical/10 border border-status-critical/30 text-status-critical'
                                : r.decision === 'ALLOW'
                                ? 'bg-status-safe/10 border border-status-safe/30 text-status-safe'
                                : r.decision === 'DETECT'
                                ? 'bg-status-warning/10 border border-status-warning/30 text-status-warning'
                                : 'bg-status-info/10 border border-status-info/30 text-status-info'
                            }`}
                          >
                            {r.decision}
                          </span>
                        </td>
                        <td className="py-2 px-space-sm text-primary">{r.tool}</td>
                        <td className="py-2 px-space-sm truncate max-w-[200px]">{r.rule}</td>
                        <td className="py-2 px-space-sm text-text-muted">{r.risk}</td>
                        <td className="py-2 px-space-md text-right text-text-muted">{r.latency}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Forensic Inspector Drawer (4 cols) */}
          <div className="xl:col-span-4 bg-surface-primary border border-border-subtle rounded p-space-md flex flex-col gap-3 font-mono text-[11px]">
            <div className="flex items-center justify-between border-b border-border-subtle pb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">manage_search</span>
                <span className="font-headline-sm text-[13px] text-text-primary font-semibold">
                  Event Forensics Inspector
                </span>
              </div>
              <span className="text-text-muted">{selectedRecord.id}</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center p-2 rounded bg-surface-secondary border border-border-subtle">
                <span className="text-text-muted">Enforcement Decision:</span>
                <span className={`font-bold ${selectedRecord.decision === 'BLOCK' ? 'text-status-critical' : selectedRecord.decision === 'ALLOW' ? 'text-status-safe' : 'text-status-warning'}`}>
                  {selectedRecord.decision}
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded bg-surface-secondary border border-border-subtle">
                <span className="text-text-muted">Tool Dispatched:</span>
                <span className="text-primary font-semibold">{selectedRecord.tool}()</span>
              </div>

              <div className="flex justify-between items-center p-2 rounded bg-surface-secondary border border-border-subtle">
                <span className="text-text-muted">Source Ingestion:</span>
                <span className="text-text-primary truncate max-w-[180px]">{selectedRecord.source}</span>
              </div>

              <div className="flex flex-col p-2 rounded bg-surface-secondary border border-border-subtle gap-1">
                <span className="text-text-muted">Security Policy Rule:</span>
                <span className="text-text-primary font-semibold">{selectedRecord.rule}</span>
              </div>

              <div className="flex flex-col p-2 rounded bg-surface-secondary border border-border-subtle gap-1">
                <span className="text-text-muted">Cryptographic Proof Hash:</span>
                <span className="text-primary break-all select-all text-[10px]">
                  SHA256: {selectedRecord.sha}...ec449f82
                </span>
              </div>

              <div className="flex justify-between items-center p-2 rounded bg-surface-secondary border border-border-subtle">
                <span className="text-text-muted">Intercept Latency:</span>
                <span className="text-status-safe font-semibold">{selectedRecord.latency}</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Downloading raw SARIF packet for ${selectedRecord.id}...`)}
              className="mt-2 w-full h-8 bg-surface-secondary hover:bg-surface-elevated text-text-primary border border-border-strong rounded font-mono text-[11px] transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px]">code</span>
              <span>View Raw SARIF JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
