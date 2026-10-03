import React, { useState } from 'react';

export const Header: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <header className="fixed top-0 left-60 right-0 h-[52px] bg-surface-primary border-b border-border-subtle z-40 flex items-center justify-between px-space-lg select-none">
      <div className="flex items-center gap-space-md">
        {/* Protection Status Pill */}
        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded ${isPaused ? 'bg-[#E5A83B]/10 border border-[#E5A83B]/30' : 'bg-[#35C991]/10 border border-[#35C991]/30'}`}>
          <span className={`h-2 w-2 rounded-sm ${isPaused ? 'bg-status-warning' : 'bg-status-safe'}`}></span>
          <span className={`font-label-sm text-[11px] font-medium tracking-wide uppercase ${isPaused ? 'text-status-warning' : 'text-status-safe'}`}>
            {isPaused ? 'Interception Paused' : 'Protection Active'}
          </span>
        </div>

        <div className="h-4 w-px bg-border-subtle hidden xl:block"></div>

        {/* Telemetry metadata */}
        <div className="hidden xl:flex items-center gap-space-md font-label-sm text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted uppercase">Session:</span>
            <span className="bg-surface-secondary text-text-primary px-1.5 py-0.5 rounded border border-border-subtle font-mono text-[11px]">
              SES-8F31A2
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted uppercase">Target:</span>
            <span className="text-text-secondary font-mono text-[11px]">RAG-FinOps-v3</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted uppercase">Latency:</span>
            <span className="text-status-safe font-mono text-[11px]">624ms avg</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted uppercase">Mode:</span>
            <span className="text-primary font-mono text-[11px] font-medium">ENFORCING</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-space-md">
        <div className="flex items-center gap-space-xs">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="h-7 px-2.5 bg-surface-secondary hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-subtle hover:border-border-strong rounded text-label-sm font-label-sm transition-colors flex items-center gap-1.5"
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">
              {isPaused ? 'play_arrow' : 'pause'}
            </span>
            <span>{isPaused ? 'Resume Interception' : 'Pause Interception'}</span>
          </button>

          <button
            onClick={() => alert("Exporting JSON audit logs...")}
            className="h-7 px-2.5 bg-surface-secondary hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-subtle hover:border-border-strong rounded text-label-sm font-label-sm transition-colors flex items-center gap-1.5"
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">download</span>
            <span>Export Logs</span>
          </button>
        </div>

        <div className="h-4 w-px bg-border-subtle"></div>

        <div className="flex items-center gap-space-sm">
          <span className="px-2 py-0.5 rounded bg-surface-secondary border border-border-subtle text-text-muted font-code-block text-[11px] font-mono uppercase">
            PROD-US-EAST
          </span>
          <div className="flex items-center gap-2 pl-1">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-label-sm text-[11px] font-medium text-text-primary leading-tight">SEC-OPS</span>
              <span className="font-label-sm text-[9px] text-text-muted uppercase leading-tight">L3 Engineer</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
