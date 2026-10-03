import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-[#FBFBFE] border-t border-slate-200 relative z-10 text-xs font-mono text-ink-subtle">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Footer Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-ink">SENTINEL</span>
              <span>//</span>
              <span className="text-accent-blue font-bold">PromptShield</span>
            </div>
            <span className="text-ink-muted">Zero-trust security for autonomous AI agents.</span>
          </div>

          {/* Center Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-ink-muted">
            <a className="hover:text-ink transition-colors" href="#architecture">
              Product
            </a>
            <a className="hover:text-ink transition-colors" href="#architecture">
              Architecture
            </a>
            <a className="hover:text-ink transition-colors" href="#threat-pipeline">
              Security
            </a>
            <a className="hover:text-ink transition-colors" href="#benchmarks">
              Benchmarks
            </a>
            <a
              className="hover:text-ink transition-colors"
              href="https://github.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </div>

          {/* Right Hackathon Attribution */}
          <div className="text-ink-subtle">
            Built for <span className="font-bold text-ink">CodeUtsava</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
