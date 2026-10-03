import React, { useState } from 'react';
import { Sidebar, type NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { AttackPlaygroundView } from './components/AttackPlaygroundView';
import { ActionGuardView } from './components/ActionGuardView';
import { AuditLogView } from './components/AuditLogView';
import { EvaluationView } from './components/EvaluationView';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');

  return (
    <div className="bg-surface-base min-h-screen font-body-md text-text-primary antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* Fixed Left Sidebar */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Area */}
      <div className="pl-60">
        {/* Fixed Top Header */}
        <Header />

        {/* Dynamic View Router */}
        <main className="relative pt-[52px] bg-surface-base min-h-screen">
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
            <div className="p-6">
              <div className="max-w-2xl bg-surface-primary border border-border-subtle rounded p-space-lg flex flex-col gap-4 font-mono text-[12px]">
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                  <h2 className="font-headline-sm text-headline-sm text-text-primary">Engine Configuration & Policies</h2>
                  <span className="text-status-safe font-semibold">v2.4.1-prod</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded bg-surface-secondary border border-border-subtle">
                  <div>
                    <div className="font-semibold text-text-primary">Content Firewall (Input Layer 1)</div>
                    <div className="text-[11px] text-text-muted mt-0.5">Regex signature scanning, Base64/Hex decoders, and zero-width normalization.</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-status-safe/10 border border-status-safe/30 text-status-safe font-bold">ENABLED</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded bg-surface-secondary border border-border-subtle">
                  <div>
                    <div className="font-semibold text-text-primary">Action Guard Pre-Flight Gate (Output Layer 2)</div>
                    <div className="text-[11px] text-text-muted mt-0.5">RBAC resource boundaries, recipient domain allowlists, and socket severing.</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-status-safe/10 border border-status-safe/30 text-status-safe font-bold">ENFORCING</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded bg-surface-secondary border border-border-subtle">
                  <div>
                    <div className="font-semibold text-text-primary">Cryptographic Audit Hashing</div>
                    <div className="text-[11px] text-text-muted mt-0.5">SHA-256 chunk hash generation with RSA-4096 tamper-sealed signatures.</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary font-bold">ACTIVE</span>
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
