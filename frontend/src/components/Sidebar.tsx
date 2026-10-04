import React from 'react';
import { SentinelLogo } from './SentinelLogo';

export type NavTab = 'overview' | 'attack-playground' | 'action-guard' | 'audit-log' | 'evaluation' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onBackToLanding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, onBackToLanding }) => {
  const consoleItems: { id: NavTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview & Comparison', icon: 'security' },
    { id: 'attack-playground', label: 'Attack Playground', icon: 'terminal' },
    { id: 'action-guard', label: 'Action Guard Gate', icon: 'gavel' },
  ];

  const forensicsItems: { id: NavTab; label: string; icon: string }[] = [
    { id: 'audit-log', label: 'Forensic Audit Log', icon: 'receipt_long' },
    { id: 'evaluation', label: 'Evaluation Suite', icon: 'query_stats' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-gradient-to-b from-[#F8FAFD] to-[#FFFFFF] border-r border-[#E2E8F0] z-50 flex flex-col justify-between select-none transition-colors duration-150">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-[48px] px-3.5 flex items-center justify-between border-b border-[#E2E8F0] bg-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <SentinelLogo className="h-6 w-6 object-contain shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-[#0F172A] tracking-tight leading-none">
                SENTINEL
              </span>
              <span className="text-[8.5px] tracking-wider text-[#4F46E5] uppercase leading-none mt-1 font-bold">
                SECURITY GATEWAY
              </span>
            </div>
          </div>
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="p-1 text-[#64748B] hover:text-[#4F46E5] hover:bg-[#EEF2FF] rounded transition-colors"
              title="Return to Landing Page"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
            </button>
          )}
        </div>

        {/* Group: CONSOLE */}
        <div className="px-4 pt-3 pb-1">
          <span className="text-[10px] uppercase text-[#4F46E5] tracking-widest font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" /> CONSOLE
          </span>
        </div>
        <nav className="flex flex-col gap-0.5 px-2">
          {consoleItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 py-2 text-left transition-colors text-xs font-medium border-l-[3.5px] rounded-r-lg ${
                  isActive
                    ? 'bg-gradient-to-r from-[#EEF2FF] to-[#F5F3FF] text-[#4F46E5] border-[#4F46E5] font-bold shadow-sm'
                    : 'text-[#334155] border-transparent hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Group: FORENSICS */}
        <div className="px-4 pt-3.5 pb-1 mt-1 border-t border-[#E2E8F0]">
          <span className="text-[10px] uppercase text-[#0891B2] tracking-widest font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0891B2]" /> FORENSICS
          </span>
        </div>
        <nav className="flex flex-col gap-0.5 px-2">
          {forensicsItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 py-2 text-left transition-colors text-xs font-medium border-l-[3.5px] rounded-r-lg ${
                  isActive
                    ? 'bg-gradient-to-r from-[#EEF2FF] to-[#F5F3FF] text-[#4F46E5] border-[#4F46E5] font-bold shadow-sm'
                    : 'text-[#334155] border-transparent hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Group: CONFIGURATION */}
        <div className="px-4 pt-3.5 pb-1 mt-1 border-t border-[#E2E8F0]">
          <span className="text-[10px] uppercase text-[#059669] tracking-widest font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" /> CONFIGURATION
          </span>
        </div>
        <nav className="flex flex-col gap-0.5 px-2">
          <button
            onClick={() => onSelectTab('settings')}
            className={`flex items-center gap-3 px-3 py-2 text-left transition-colors text-xs font-medium border-l-[3.5px] rounded-r-lg ${
              currentTab === 'settings'
                ? 'bg-gradient-to-r from-[#EEF2FF] to-[#F5F3FF] text-[#4F46E5] border-[#4F46E5] font-bold shadow-sm'
                : 'text-[#334155] border-transparent hover:bg-[#F1F5F9] hover:text-[#0F172A]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Policy Studio</span>
          </button>
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="flex flex-col border-t border-[#E2E8F0] bg-white/90 p-2">
        <div className="p-2.5 bg-[#F8FAFD] border border-[#E2E8F0] rounded-lg flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">System Status</span>
            <div className="flex items-center gap-1.5 bg-[#ECFDF5] border border-[#A7F3D0] px-1.5 py-0.5 rounded">
              <span className="h-1.5 w-1.5 rounded-full bg-[#059669] animate-pulse"></span>
              <span className="text-[10px] font-bold text-[#059669] uppercase">Active</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#64748B]">Engine Policy</span>
            <span className="font-mono text-[11px] font-semibold text-[#4F46E5] bg-[#EEF2FF] px-1.5 py-0.5 rounded border border-[#C7D2FE]">v2.4.1-prod</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
