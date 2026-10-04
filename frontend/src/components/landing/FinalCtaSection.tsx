import React from 'react';
import { ArrowRight } from 'lucide-react';

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="py-24 md:py-32 bg-ink text-white relative z-20 overflow-hidden">
      {/* Subtle tech grid overlay */}
      <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none" />

      {/* Ambient glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
        <div className="flex justify-center mb-2">
          <img
            src="/sentinel_icon_transparent.png"
            alt="SENTINEL"
            className="w-12 h-12 object-contain"
          />
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          Put a security perimeter around your AI agents.
        </h2>

        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal">
          Detect malicious context. Control tool execution. Preserve the evidence.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="https://sentinel-cu-hackathon.streamlit.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-ink font-bold text-base shadow-float hover:bg-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
          >
            <span>Launch SENTINEL Dashboard</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>

          <a
            href="#architecture"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-slate-900/90 text-white font-semibold text-base border border-slate-700 hover:bg-slate-800 transition-all duration-200 hover:-translate-y-0.5"
          >
            <span>View Architecture</span>
          </a>
        </div>
      </div>
    </section>
  );
};
