import React, { useState, useEffect } from 'react';

type FontSizeOption = 'sm' | 'md' | 'lg';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onBackToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleTheme, onBackToLanding }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [fontSize, setFontSize] = useState<FontSizeOption>(() => {
    return (localStorage.getItem('sentinel_font_size') as FontSizeOption) || 'md';
  });

  const applyFontSize = (size: FontSizeOption) => {
    setFontSize(size);
    localStorage.setItem('sentinel_font_size', size);
    const scaleMap: Record<FontSizeOption, string> = {
      sm: '14px',
      md: '16px',
      lg: '18px',
    };
    document.documentElement.style.fontSize = scaleMap[size];
  };

  useEffect(() => {
    const saved = (localStorage.getItem('sentinel_font_size') as FontSizeOption) || 'md';
    applyFontSize(saved);
  }, []);

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

        {/* Font Size Selector */}
        <div
          className="flex items-center bg-surface-secondary border border-border-subtle rounded h-8 p-0.5"
          title="Adjust Dashboard Font Size"
        >
          {(['sm', 'md', 'lg'] as const).map((size) => {
            const labels = { sm: 'A-', md: 'A', lg: 'A+' };
            const isActive = fontSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => applyFontSize(size)}
                className={`h-6 px-2 rounded text-[11px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                }`}
                title={`Font size: ${size === 'sm' ? 'Small (14px)' : size === 'md' ? 'Default (16px)' : 'Large (18px)'}`}
                aria-pressed={isActive}
              >
                {labels[size]}
              </button>
            );
          })}
        </div>

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
      </div>
    </header>
  );
};
