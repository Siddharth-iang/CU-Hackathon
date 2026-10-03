import React, { useState, useEffect } from 'react';

export const ThreatFlowSection: React.FC = () => {
  const [mode, setMode] = useState<'injection' | 'action'>('injection');
  const [signalPos, setSignalPos] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  // Smooth continuous looping animation for horizontal pipeline
  useEffect(() => {
    let animFrame: number;
    let start = performance.now();

    const loop = (now: number) => {
      const elapsed = now - start;
      const duration = 3600; // 3.6 second loop
      const progress = (elapsed % duration) / duration;
      setSignalPos(progress);
      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Automatic mode switching every 10 seconds if autoPlay is active
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setMode((prev) => (prev === 'injection' ? 'action' : 'injection'));
    }, 9000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  // Max percentage where signal travels:
  // Step 3 (Firewall) is ~48%, Step 5 (Action Guard) is ~82%
  const maxPercent = mode === 'injection' ? 48 : 82;
  const currentLeft = signalPos * maxPercent;
  const signalOpacity = signalPos > 0.88 ? 1 - (signalPos - 0.88) * 8 : 1;

  return (
    <section className="py-24 bg-white border-y border-slate-200/80 relative z-10" id="threat-pipeline">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-ink-subtle mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
            <span>INTERACTIVE ATTACK SIMULATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
            From injection to blocked action.
          </h2>
          <p className="text-ink-muted text-base mt-2">
            Watch an adversarial attack move through the dual-layer security boundary in real-time.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setMode('injection');
                setAutoPlay(false);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
                mode === 'injection'
                  ? 'bg-red-50 border-red-300 text-red-800 shadow-sm ring-2 ring-red-200/60'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${mode === 'injection' ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>Scenario 1: Threat at Content Firewall</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('action');
                setAutoPlay(false);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
                mode === 'action'
                  ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-sm ring-2 ring-amber-200/60'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${mode === 'action' ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`} />
              <span>Scenario 2: Threat at Action Guard</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-ink-subtle">
            <button
              type="button"
              onClick={() => setAutoPlay((p) => !p)}
              className={`px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 ${
                autoPlay ? 'bg-sky-50 text-accent-blue border-sky-200' : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${autoPlay ? 'bg-accent-blue' : 'bg-slate-400'}`} />
              <span>{autoPlay ? 'Auto-cycling' : 'Cycle Paused'}</span>
            </button>
          </div>
        </div>

        {/* Continuous Horizontal Pipeline Container */}
        <div className="bg-[#FBFBFE] rounded-2xl p-6 md:p-10 border border-slate-200 shadow-subtle relative overflow-hidden">
          {/* Live Continuous Signal Rail */}
          <div className="relative w-full h-1.5 bg-slate-200 rounded-full mb-10 overflow-hidden">
            <div
              className={`absolute top-0 h-full w-28 bg-gradient-to-r from-transparent ${
                mode === 'injection' ? 'via-red-500' : 'via-amber-500'
              } to-transparent transition-opacity duration-200`}
              style={{
                left: `${currentLeft}%`,
                opacity: signalOpacity,
              }}
            />
          </div>

          {/* Horizontal Pipeline: 6 Connected Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 relative text-center font-mono">
            {/* Step 1: USER INTENT */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-center min-h-[96px] transition-all hover:border-slate-300">
              <span className="font-bold text-xs text-ink">USER INTENT</span>
              <span className="text-[11px] text-emerald-600 mt-2 font-semibold flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Verified
              </span>
            </div>

            {/* Step 2: UNTRUSTED DATA */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-center min-h-[96px] transition-all hover:border-slate-300">
              <span className="font-bold text-xs text-ink">UNTRUSTED DATA</span>
              <span
                className={`text-[11px] mt-2 font-bold ${
                  mode === 'injection' ? 'text-red-600' : 'text-amber-600'
                }`}
              >
                {mode === 'injection' ? 'Poisoned Doc' : 'Canary Taint'}
              </span>
            </div>

            {/* Step 3: CONTENT FIREWALL */}
            <div
              className={`p-4 rounded-xl flex flex-col justify-center min-h-[96px] transition-all duration-300 ${
                mode === 'injection'
                  ? 'bg-red-50/90 border-2 border-red-300 shadow-sm ring-2 ring-red-200/50'
                  : 'bg-white border border-slate-200 shadow-sm'
              }`}
            >
              <span className="font-bold text-xs text-ink">CONTENT FIREWALL</span>
              {mode === 'injection' ? (
                <span className="text-[11px] font-bold text-red-700 bg-red-100/90 px-2 py-0.5 rounded mt-2 animate-pulse">
                  THREAT DETECTED
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-emerald-600 mt-2">
                  Taint Tagged
                </span>
              )}
            </div>

            {/* Step 4: AI AGENT */}
            <div
              className={`p-4 rounded-xl flex flex-col justify-center min-h-[96px] transition-all duration-300 ${
                mode === 'injection'
                  ? 'bg-white border border-slate-200 opacity-60 shadow-sm'
                  : 'bg-white border border-slate-200 shadow-sm'
              }`}
            >
              <span className="font-bold text-xs text-ink">AI AGENT</span>
              <span
                className={`text-[11px] mt-2 ${
                  mode === 'injection' ? 'text-slate-400' : 'text-slate-700 font-semibold'
                }`}
              >
                {mode === 'injection' ? 'Isolated' : 'send_email()'}
              </span>
            </div>

            {/* Step 5: ACTION GUARD */}
            <div
              className={`p-4 rounded-xl flex flex-col justify-center min-h-[96px] transition-all duration-300 ${
                mode === 'action'
                  ? 'bg-red-50/90 border-2 border-red-300 shadow-sm ring-2 ring-red-200/50'
                  : 'bg-white border border-slate-200 opacity-60 shadow-sm'
              }`}
            >
              <span className="font-bold text-xs text-ink">ACTION GUARD</span>
              {mode === 'action' ? (
                <span className="text-[10px] font-bold text-red-700 bg-red-100/90 px-2 py-0.5 rounded mt-2 animate-pulse leading-tight">
                  BLOCK (SCOPE)
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 mt-2">Standby</span>
              )}
            </div>

            {/* Step 6: TOOL SANDBOX */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 opacity-60 shadow-sm flex flex-col justify-center min-h-[96px] transition-all duration-300">
              <span className="font-bold text-xs text-ink">TOOL SANDBOX</span>
              <span className="text-[11px] text-slate-400 mt-2">
                {mode === 'injection' ? 'Prevented' : 'BLOCKED'}
              </span>
            </div>
          </div>

          {/* Prominent Status Readout Banner */}
          <div
            className={`mt-8 p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors duration-300 ${
              mode === 'injection'
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-2.5 h-2.5 rounded-full animate-ping ${
                  mode === 'injection' ? 'bg-red-500' : 'bg-amber-500'
                }`}
              />
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wide uppercase">
                {mode === 'injection'
                  ? 'BLOCKED BEFORE EXECUTION · PROMPT INJECTION QUARANTINED'
                  : 'BLOCKED BEFORE EXECUTION · UNAUTHORIZED EGRESS PREVENTED'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-white px-3 py-1 rounded border border-slate-200 shadow-sm text-ink">
                {mode === 'injection' ? '0.94 ms' : '1.12 ms'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
