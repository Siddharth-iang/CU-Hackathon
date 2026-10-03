import React from 'react';
import { FileCheck } from 'lucide-react';

export const ComplianceSection: React.FC = () => {
  const standards = [
    { code: 'OWASP LLM01', desc: 'Prompt Injection Defense' },
    { code: 'OWASP LLM02', desc: 'Sensitive Info Disclosure' },
    { code: 'SOC 2 CC6.1', desc: 'Logical Access Security' },
    { code: 'SOC 2 CC6.6', desc: 'Boundary Protection' },
    { code: 'SOC 2 CC6.8', desc: 'Unauthorized Software / Tool Execution' },
  ];

  return (
    <section className="py-20 relative z-10 bg-[#FBFBFE]" id="compliance">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-mono font-bold text-ink-subtle tracking-wider uppercase shadow-2xs mb-2">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>AUDIT-READY BY DESIGN</span>
          </div>
          <p className="text-base text-ink-muted max-w-xl mx-auto">
            Tamper-evident logs and cryptographic audit seals for every security decision.
          </p>
        </div>

        {/* Minimalist Inline Technical Reference Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 font-mono text-xs pt-1">
          {standards.map((s) => (
            <span
              key={s.code}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-subtle text-ink font-semibold hover:border-slate-300 transition-colors"
              title={s.desc}
            >
              {s.code}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
