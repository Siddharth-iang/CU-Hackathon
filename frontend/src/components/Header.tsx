import React, { useState } from 'react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onBackToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleTheme, onBackToLanding }) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <header className="fixed top-0 left-60 right-0 h-[52px] bg-surface-primary border-b border-border-subtle z-40 flex items-center justify-between px-space-lg select-none transition-colors duration-150">
      <div className="flex items-center gap-space-md">
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="h-8 px-2.5 bg-surface-secondary hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-subtle rounded text-[12px] font-medium transition-colors flex items-center gap-1.5 mr-2"
            type="button"
            title="Return to Landing Page"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Landing Page</span>
          </button>
        )}

        {/* Protection Status Pill */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded text-[12px] font-medium transition-colors ${
            isPaused
              ? 'bg-status-warning/10 border border-status-warning/30 text-status-warning'
              : 'bg-status-safe/10 border border-status-safe/30 text-status-safe'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isPaused ? 'bg-status-warning' : 'bg-status-safe animate-pulse'
            }`}
          />
          <span className="font-semibold tracking-wide">
            {isPaused ? 'Interception Paused' : 'Protection Active'}
          </span>
        </div>

        <div className="h-4 w-px bg-border-subtle hidden xl:block" />

        {/* Telemetry metadata */}
        <div className="hidden xl:flex items-center gap-space-md text-[12px]">
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted">Session:</span>
            <span className="font-mono text-text-primary px-1.5 py-0.5 rounded bg-surface-secondary border border-border-subtle text-[11px]">
              SES-8F31A2
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted">Target:</span>
            <span className="font-mono text-text-secondary text-[11px]">RAG-FinOps-v3</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted">Latency:</span>
            <span className="text-status-safe font-medium">18ms</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted">Policy:</span>
            <span className="text-primary font-semibold text-[11px] bg-primary/10 px-1.5 py-0.5 rounded">
              ENFORCING
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-space-sm">
        {/* Launch Dashboard Button */}
        <a
          href="https://sentinel-cu-hackathon.streamlit.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-[12px] font-semibold transition-all shadow-xs flex items-center gap-1.5"
          title="Launch Sentinel Streamlit Dashboard (https://sentinel-cu-hackathon.streamlit.app/)"
        >
          <span className="material-symbols-outlined text-[15px]">rocket_launch</span>
          <span className="hidden sm:inline">Launch Dashboard</span>
          <span className="material-symbols-outlined text-[13px] opacity-80">open_in_new</span>
        </a>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={onToggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="h-8 px-2.5 bg-surface-secondary hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-subtle rounded text-[12px] font-medium transition-colors flex items-center gap-1.5"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
          <span className="hidden sm:inline font-sans text-[11px]">
            {isDarkMode ? 'Light' : 'Dark'}
          </span>
        </button>

        {/* Interception Toggle */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="h-8 px-2.5 bg-surface-secondary hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-subtle rounded text-[12px] font-medium transition-colors flex items-center gap-1.5"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">
            {isPaused ? 'play_arrow' : 'pause'}
          </span>
          <span className="hidden md:inline font-sans text-[11px]">
            {isPaused ? 'Resume' : 'Pause'}
          </span>
        </button>

        <div className="h-4 w-px bg-border-subtle" />

        {/* User Info / Environment */}
        <div className="flex items-center gap-2 pl-1">
          <span className="px-2 py-0.5 rounded bg-surface-secondary border border-border-subtle text-text-muted font-mono text-[11px] hidden sm:inline">
            PROD-US-EAST
          </span>
          <div className="w-8 h-8 rounded-full bg-surface-secondary border border-border-subtle flex items-center justify-center text-text-primary font-semibold text-[12px]">
            <span className="material-symbols-outlined text-[16px] text-primary">security</span>
          </div>
        </div>
      </div>
    </header>
  );
};
