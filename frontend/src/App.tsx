import React, { useState, useEffect } from 'react';
import { Sidebar, type NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { AttackPlaygroundView } from './components/AttackPlaygroundView';
import { ActionGuardView } from './components/ActionGuardView';
import { AuditLogView } from './components/AuditLogView';
import { EvaluationView } from './components/EvaluationView';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sentinel_theme');
    if (saved) return saved === 'dark';
    return true; // default dark, user can toggle to light
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sentinel_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sentinel_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="bg-canvas min-h-screen font-sans text-text-primary antialiased transition-colors duration-150">
      {/* Fixed Left Sidebar */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Area */}
      <div className="pl-60">
        {/* Fixed Top Header */}
        <Header isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />

        {/* Dynamic View Router */}
        <main className="relative pt-[52px] bg-canvas min-h-screen">
          {currentTab === 'overview' && (
            <OverviewView onNavigateToPlayground={() => setCurrentTab('attack-playground')} />
          )}

          {currentTab === 'attack-playground' && (
            <AttackPlaygroundView onNavigateToActionGuard={() => setCurrentTab('action-guard')} />
          )}

          {currentTab === 'action-guard' && <ActionGuardView />}

          {currentTab === 'audit-log' && <AuditLogView />}

          {currentTab === 'evaluation' && <EvaluationView />}

          {currentTab === 'settings' && (
            <div className="p-8 max-w-4xl mx-auto">
              <div className="bg-surface border border-border-subtle rounded-lg p-6 flex flex-col gap-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">Engine Configuration & Policies</h2>
                    <p className="text-sm text-text-muted mt-1">
                      Production security boundaries and cryptographic verification status.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-status-safe/10 border border-status-safe/30 text-status-safe text-xs font-semibold">
                    v2.4.1-prod
                  </span>
                </div>

                <div className="grid gap-3">
                  <div className="flex justify-between items-center p-4 rounded-md bg-surface-secondary border border-border-subtle">
                    <div>
                      <div className="font-medium text-text-primary text-sm">Content Firewall (Input Layer 1)</div>
                      <div className="text-xs text-text-muted mt-0.5">
                        Regex signature scanning, Base64/Hex decoders, and zero-width normalization.
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-status-safe/10 border border-status-safe/30 text-status-safe text-xs font-bold">
                      ENABLED
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-4 rounded-md bg-surface-secondary border border-border-subtle">
                    <div>
                      <div className="font-medium text-text-primary text-sm">Action Guard Pre-Flight Gate (Output Layer 2)</div>
                      <div className="text-xs text-text-muted mt-0.5">
                        RBAC resource boundaries, recipient domain allowlists, and socket severing.
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-status-safe/10 border border-status-safe/30 text-status-safe text-xs font-bold">
                      ENFORCING
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-4 rounded-md bg-surface-secondary border border-border-subtle">
                    <div>
                      <div className="font-medium text-text-primary text-sm">Cryptographic Audit Hashing</div>
                      <div className="text-xs text-text-muted mt-0.5">
                        SHA-256 chunk hash generation with RSA-4096 tamper-sealed signatures.
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary text-xs font-bold">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
