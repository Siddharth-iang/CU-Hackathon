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
        <a className="flex items-center group" href="#">
          <img
            src="/sentinel_logo_horizontal_transparent.png"
            alt="SENTINEL PromptShield"
            className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
          />
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
            href="https://sentinel-cu-hackathon.streamlit.app/"
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
