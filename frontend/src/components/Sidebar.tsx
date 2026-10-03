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
    <aside className="fixed left-0 top-0 h-full w-60 bg-surface-primary border-r border-border-subtle z-50 flex flex-col justify-between select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-[52px] px-space-md flex items-center gap-space-sm border-b border-border-subtle bg-surface-primary">
          <SentinelLogo className="h-8 w-8 object-contain shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-headline-sm text-headline-sm text-text-primary tracking-tight leading-none">
              SENTINEL
            </span>
            <span className="font-label-sm text-[10px] tracking-wider text-text-muted uppercase leading-none mt-space-2xs">
              AGENT SECURITY FIREWALL
            </span>
          </div>
        </div>

        {/* Console Navigation Section */}
        <div className="px-space-md pt-space-md pb-space-xs">
          <span className="font-label-sm text-[10px] uppercase text-text-muted tracking-widest font-semibold">
            Console Navigation
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-space-2xs px-space-xs">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-space-sm px-space-sm py-2 rounded text-left transition-colors text-body-md font-body-md ${
                  isActive
                    ? 'bg-surface-secondary text-text-primary border-l-2 border-primary-container font-medium'
                    : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="flex flex-col border-t border-border-subtle bg-surface-primary">
        <div className="px-space-md py-space-sm border-b border-border-subtle flex flex-col gap-space-2xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-[10px] text-text-muted uppercase tracking-wider">System Status</span>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-status-safe animate-pulse"></span>
              <span className="font-label-sm text-[10px] font-medium text-status-safe uppercase">Online</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-body-sm font-body-sm">
            <span className="font-label-sm text-[11px] text-text-muted">Engine Policy</span>
            <span className="font-code-block text-[11px] text-text-secondary font-mono">v2.4.1-prod</span>
          </div>
        </div>

        <div className="p-space-xs">
          <button
            onClick={() => onSelectTab('settings')}
            className={`w-full flex items-center gap-space-sm px-space-sm py-2 rounded text-left transition-colors text-body-md font-body-md ${
              currentTab === 'settings'
                ? 'bg-surface-secondary text-text-primary border-l-2 border-primary-container font-medium'
                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
