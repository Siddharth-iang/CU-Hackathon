import React, { useState } from 'react';
import { Clock } from 'lucide-react';

interface StageData {
  step: number;
  name: string;
  timestamp: string;
  progressPercent: string;
  threat: string;
  threatColor: string;
  action: string;
  decision: string;
  decisionBadgeClass: string;
  canary: string;
  audit: string;
  description: string;
}

const STAGES: StageData[] = [
  {
    step: 1,
    name: 'INGEST',
    timestamp: 'T + 0.0 ms',
    progressPercent: '10%',
    threat: 'Unverified Payload',
    threatColor: 'text-slate-600',
    action: 'ingest_document',
    decision: 'EVALUATING',
    decisionBadgeClass: 'text-blue-700 bg-blue-50 border-blue-200',
    canary: 'INJECTED (0x4A)',
    audit: 'STAGE 1 LOGGED',
    description: 'Incoming PDF parsed and scanned for hidden Unicode zero-width tags and Base64 sequences.',
  },
  {
    step: 2,
    name: 'FIREWALL',
    timestamp: 'T + 218.4 ms',
    progressPercent: '35%',
    threat: 'Delimiters Sanitized',
    threatColor: 'text-amber-600',
    action: 'decode_context',
    decision: 'SANITIZED',
    decisionBadgeClass: 'text-amber-700 bg-amber-50 border-amber-200',
    canary: 'CANARY BOUND',
    audit: 'HASH CERTIFIED',
    description: 'Content firewall detected prompt injection attempt in document metadata and applied semantic isolation.',
  },
  {
    step: 3,
    name: 'LLM ISOLATION',
    timestamp: 'T + 481.2 ms',
    progressPercent: '60%',
    threat: 'Spotlight Boundary',
    threatColor: 'text-accent-blue',
    action: 'reasoning_pass',
    decision: 'ISOLATED',
    decisionBadgeClass: 'text-accent-blue bg-blue-50 border-blue-200',
    canary: 'TRACKING ACTIVE',
    audit: 'SIGNATURE GENERATED',
    description: 'LLM executes inside constrained reasoning box. Canary token embedded in generated thought plan.',
  },
  {
    step: 4,
    name: 'ACTION GUARD',
    timestamp: 'T + 841.6 ms',
    progressPercent: '80%',
    threat: 'Prompt Injection',
    threatColor: 'text-red-600 font-bold',
    action: 'send_email',
    decision: 'BLOCK',
    decisionBadgeClass: 'text-red-700 bg-red-50 border-red-200 font-bold',
    canary: 'DETECTED',
    audit: 'INCIDENT LOGGED',
    description: 'Action Guard intercepted unauthorized outbound socket tool call before execution. Canary leak prevented.',
  },
  {
    step: 5,
    name: 'AUDIT',
    timestamp: 'T + 842.1 ms (SEALED)',
    progressPercent: '100%',
    threat: 'Forensic Record Ready',
    threatColor: 'text-emerald-600 font-bold',
    action: 'immutable_commit',
    decision: 'TAMPER-PROOF',
    decisionBadgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200 font-bold',
    canary: 'CONTAINED',
    audit: 'SHA-256 SEALED',
    description: 'Cryptographic SHA-256 hash generated and sealed into tamper-evident audit ledger with RSA signature.',
  },
];

export const ForensicReplaySection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(4);
  const currentStage = STAGES.find((s) => s.step === activeStep) || STAGES[3];

  return (
    <section className="py-24 md:py-32 bg-white border-y border-slate-200/80 relative z-10" id="forensics">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl space-y-2 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-ink-subtle mb-1">
            <Clock className="w-3.5 h-3.5 text-accent-blue" />
            <span>SUB-MILLISECOND AUDIT TRAIL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
            Replay every security decision.
          </h2>
          <p className="text-lg text-ink-muted">
            Every incident becomes an immutable forensic timeline with complete causal traceability.
          </p>
        </div>

        {/* Forensic Timeline Card */}
        <div className="bg-[#FBFBFE] rounded-2xl p-6 md:p-10 border border-slate-200 shadow-card space-y-10">
          {/* 5-Stage Visual Timeline with Scrubber */}
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-ink-subtle">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
                INCIDENT TIMELINE REPLAY
              </span>
              <span className="text-accent-blue font-semibold bg-white px-2.5 py-1 rounded border border-slate-200 shadow-xs">
                {currentStage.timestamp}
              </span>
            </div>

            <div className="relative py-4">
              {/* Background Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />

              {/* Progress Fill */}
              <div
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-accent-blue via-emerald-500 to-red-500 -translate-y-1/2 z-0 transition-all duration-300"
                style={{ width: currentStage.progressPercent }}
              />

              {/* 5 Stages: 01 INGEST → 02 FIREWALL → 03 LLM ISOLATION → 04 ACTION GUARD → 05 AUDIT */}
              <div className="relative z-10 grid grid-cols-5 text-center font-mono">
                {STAGES.map((s) => {
                  const isActive = s.step === activeStep;
                  const isPassed = s.step < activeStep;
                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setActiveStep(s.step)}
                      className="flex flex-col items-center group cursor-pointer focus:outline-none"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 shadow-subtle ${
                          isActive
                            ? s.step === 4
                              ? 'bg-red-600 border-2 border-red-300 text-white scale-110 ring-4 ring-red-100'
                              : 'bg-accent-blue border-2 border-sky-300 text-white scale-110 ring-4 ring-sky-100'
                            : isPassed
                            ? 'bg-white border-2 border-accent-blue text-accent-blue group-hover:scale-105'
                            : 'bg-white border-2 border-slate-300 text-slate-500 group-hover:scale-105 group-hover:border-slate-400'
                        }`}
                      >
                        0{s.step}
                      </div>
                      <span
                        className={`text-xs mt-2 transition-colors ${
                          isActive
                            ? s.step === 4
                              ? 'font-bold text-red-600'
                              : 'font-bold text-accent-blue'
                            : 'font-semibold text-ink-subtle group-hover:text-ink'
                        }`}
                      >
                        {s.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Telemetry Readout Panel: Clean Key-Value Pairs */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-subtle font-mono text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">THREAT</span>
                <span className={`text-sm mt-0.5 block truncate ${currentStage.threatColor}`}>
                  {currentStage.threat}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">ACTION</span>
                <span className="font-bold text-ink text-sm mt-0.5 block font-mono">
                  {currentStage.action}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">DECISION</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded border text-xs mt-0.5 ${currentStage.decisionBadgeClass}`}
                >
                  {currentStage.decision}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">CANARY</span>
                <span className="font-bold text-amber-600 text-sm mt-0.5 block">
                  {currentStage.canary}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">AUDIT</span>
                <span className="font-bold text-emerald-700 text-sm mt-0.5 block">
                  {currentStage.audit}
                </span>
              </div>
            </div>

            {/* Stage Description Bar */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-ink-muted">
              <span>{currentStage.description}</span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Click any stage (01–05) to scrub timeline
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
