import React from 'react';
import { SentinelLogo } from './SentinelLogo';

export type NavTab = 'overview' | 'attack-playground' | 'action-guard' | 'audit-log' | 'evaluation' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const navItems: { id: NavTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'security' },
    { id: 'attack-playground', label: 'Attack Playground', icon: 'terminal' },
    { id: 'action-guard', label: 'Action Guard', icon: 'gavel' },
    { id: 'audit-log', label: 'Audit Log', icon: 'receipt_long' },
    { id: 'evaluation', label: 'Evaluation', icon: 'query_stats' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-surface border-r border-border-subtle z-50 flex flex-col justify-between select-none transition-colors duration-150">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-[52px] px-4 flex items-center gap-3 border-b border-border-subtle bg-surface">
          <SentinelLogo className="h-7 w-7 object-contain shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-text-primary tracking-tight leading-none">
              SENTINEL
            </span>
            <span className="text-[9px] tracking-wider text-text-muted uppercase leading-none mt-1 font-semibold">
              AGENT SECURITY FIREWALL
            </span>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-4 pt-5 pb-2">
          <span className="text-[10px] uppercase text-text-muted tracking-widest font-semibold">
            Console Navigation
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 px-2.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors text-xs font-medium ${
                  isActive
                    ? 'bg-surface-secondary text-primary font-semibold'
                    : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="flex flex-col border-t border-border-subtle bg-surface">
        <div className="px-4 py-3 border-b border-border-subtle flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-medium">System Status</span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-status-safe animate-pulse"></span>
              <span className="text-[10px] font-semibold text-status-safe uppercase">Online</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] text-text-muted">Engine Policy</span>
            <span className="font-mono text-[11px] text-text-secondary">v2.4.1-prod</span>
          </div>
        </div>

        <div className="p-2">
          <button
            onClick={() => onSelectTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors text-xs font-medium ${
              currentTab === 'settings'
                ? 'bg-surface-secondary text-primary font-semibold'
                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
