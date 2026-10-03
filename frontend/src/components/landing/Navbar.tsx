import React, { useState, useEffect } from 'react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 glass-nav transition-all duration-300 ${
        isScrolled ? 'shadow-xs border-b border-slate-200/90 py-1' : 'py-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a className="flex items-center gap-3.5 group" href="#">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ink via-slate-900 to-sky-950 flex items-center justify-center shadow-subtle group-hover:shadow transition-all border border-slate-700/40 group-hover:border-sky-500/50">
            <svg
              className="w-5 h-5 text-sky-400"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" stroke="#10B981" strokeWidth="2.5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-ink font-sans">SENTINEL</span>
              <span className="text-xs text-ink-subtle font-mono font-medium tracking-wider">//</span>
              <span className="text-xs font-bold text-accent-blue tracking-wider font-mono">PROMPTSHIELD</span>
            </div>
            <span className="text-[10px] text-ink-subtle tracking-wider uppercase font-mono font-medium">
              Autonomous Zero-Trust
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-muted">
          <a className="hover:text-ink transition-colors" href="#architecture">
            Architecture
          </a>
          <a className="hover:text-ink transition-colors" href="#threat-pipeline">
            Threat Flow
          </a>
          <a className="hover:text-ink transition-colors" href="#benchmarks">
            Benchmarks
          </a>
          <a className="hover:text-ink transition-colors" href="#forensics">
            Forensics
          </a>
          <a className="hover:text-ink transition-colors" href="#compliance">
            Compliance
          </a>
        </nav>

        {/* Right Action CTA */}
        <div className="flex items-center gap-3">
          <a
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-white font-medium text-sm shadow-subtle hover:bg-slate-800 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg border border-slate-800 active:translate-y-0 cursor-pointer"
            href="https://sentinel-dashboard.streamlit.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Launch Dashboard</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </header>
  );
};
