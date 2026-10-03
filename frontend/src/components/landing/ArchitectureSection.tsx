import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';

export const ArchitectureSection: React.FC = () => {
  const [firewallStep, setFirewallStep] = useState<number>(0);
  const [guardStep, setGuardStep] = useState<number>(0);

  // Animated pipeline signal pulses
  useEffect(() => {
    const fTimer = setInterval(() => {
      setFirewallStep((prev) => (prev + 1) % 4);
    }, 1800);

    const gTimer = setInterval(() => {
      setGuardStep((prev) => (prev + 1) % 4);
    }, 2200);

    return () => {
      clearInterval(fTimer);
      clearInterval(gTimer);
    };
  }, []);

  const firewallNodes = ['INPUT', 'DECODE', 'DETECT', 'QUARANTINE'];
  const guardNodes = ['AGENT', 'INSPECT', 'POLICY', 'DECISION'];

  return (
    <section className="py-24 md:py-32 relative z-10 bg-[#FBFBFE]" id="architecture">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-mono font-medium text-ink shadow-subtle mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
            <span>DUAL-LAYER ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
            Two layers. One security boundary.
          </h2>
          <p className="text-lg text-ink-muted max-w-xl mx-auto">
            PromptShield protects both agent context and agent actions before runtime execution.
          </p>
        </div>

        {/* Two Large Side-by-Side Cards using shadcn Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CARD 01: Layer 01 Content Firewall */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Card className="p-8 sm:p-12 h-full flex flex-col justify-between hover:border-slate-300 hover:shadow-lg transition-all">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <span className="text-xs font-mono font-bold text-accent-blue tracking-wider uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-blue" />
                    LAYER 01
                  </span>
                  <span className="text-xs font-mono text-ink-subtle">Ingress Gate</span>
                </div>

                <h3 className="text-3xl font-bold text-ink mt-6 mb-2">
                  Content Firewall
                </h3>
                <p className="text-ink-muted text-base mb-8">
                  Stop malicious instructions and hidden injections before they reach the agent context.
                </p>

                {/* Visual Pipeline: INPUT → DECODE → DETECT → QUARANTINE */}
                <div className="bg-white rounded-xl p-5 border border-slate-200/90 mb-8 shadow-subtle">
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2 text-xs font-mono text-center">
                    {firewallNodes.map((node, idx) => {
                      const isPulse = firewallStep === idx;
                      let style = 'bg-slate-50 border-slate-200 text-slate-700 font-semibold';
                      if (node === 'DETECT') {
                        style = isPulse
                          ? 'bg-blue-100 border-blue-400 font-bold text-accent-blue shadow-xs'
                          : 'bg-blue-50 border-blue-200 font-bold text-accent-blue';
                      } else if (node === 'QUARANTINE') {
                        style = isPulse
                          ? 'bg-amber-100 border-amber-400 font-bold text-amber-700 shadow-xs'
                          : 'bg-amber-50 border-amber-200 font-bold text-amber-700';
                      } else if (isPulse) {
                        style = 'bg-slate-200 border-slate-300 font-bold text-ink';
                      }

                      return (
                        <React.Fragment key={node}>
                          <div
                            className={`flex-1 py-3 px-1 sm:px-2 rounded-lg border transition-all duration-300 ${style}`}
                          >
                            {node}
                          </div>
                          {idx < firewallNodes.length - 1 && (
                            <span className="text-slate-400 text-xs">→</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* 3 Clean Capability Tags */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-mono text-ink shadow-2xs font-medium">
                    Zero-Width
                  </span>
                  <span className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-mono text-ink shadow-2xs font-medium">
                    Base64
                  </span>
                  <span className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-mono text-accent-blue font-semibold shadow-2xs">
                    Spotlighting
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* CARD 02: Layer 02 Action Guard */}
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Card className="p-8 sm:p-12 h-full flex flex-col justify-between hover:border-slate-300 hover:shadow-lg transition-all">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <span className="text-xs font-mono font-bold text-emerald-600 tracking-wider uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    LAYER 02
                  </span>
                  <span className="text-xs font-mono text-ink-subtle">Egress Pre-flight</span>
                </div>

                <h3 className="text-3xl font-bold text-ink mt-6 mb-2">
                  Action Guard
                </h3>
                <p className="text-ink-muted text-base mb-8">
                  Stop unsafe tool calls, data exfiltration, and socket hijacking before execution.
                </p>

                {/* Visual Pipeline: AGENT → INSPECT → POLICY → DECISION */}
                <div className="bg-white rounded-xl p-5 border border-slate-200/90 mb-8 shadow-subtle space-y-4">
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2 text-xs font-mono text-center">
                    {guardNodes.map((node, idx) => {
                      const isPulse = guardStep === idx;
                      let style = 'bg-slate-50 border-slate-200 text-slate-700 font-semibold';
                      if (node === 'INSPECT') {
                        style = isPulse
                          ? 'bg-blue-100 border-blue-400 font-bold text-accent-blue'
                          : 'bg-blue-50 border-blue-200 font-bold text-accent-blue';
                      } else if (node === 'POLICY') {
                        style = isPulse
                          ? 'bg-indigo-100 border-indigo-400 font-bold text-indigo-700'
                          : 'bg-indigo-50 border-indigo-200 font-bold text-indigo-700';
                      } else if (node === 'DECISION') {
                        style = isPulse
                          ? 'bg-slate-200 border-slate-400 font-bold text-ink'
                          : 'bg-slate-100 border-slate-300 font-bold text-ink';
                      }

                      return (
                        <React.Fragment key={node}>
                          <div
                            className={`flex-1 py-3 px-1 sm:px-2 rounded-lg border transition-all duration-300 ${style}`}
                          >
                            {node}
                          </div>
                          {idx < guardNodes.length - 1 && (
                            <span className="text-slate-400 text-xs">→</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Decision States: ALLOW, BLOCK, ASK HUMAN */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 pt-1 text-[11px] font-mono font-bold">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ALLOW
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      BLOCK
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      ASK HUMAN
                    </span>
                  </div>
                </div>

                {/* 3 Clean Capability Tags */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-mono text-ink shadow-2xs font-medium">
                    Scope
                  </span>
                  <span className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-mono text-emerald-600 font-semibold shadow-2xs">
                    Canary
                  </span>
                  <span className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-mono text-ink shadow-2xs font-medium">
                    Egress
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
