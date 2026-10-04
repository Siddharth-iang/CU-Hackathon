import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import Lenis from 'lenis';
import { ArrowRight } from 'lucide-react';
import { Navbar } from './Navbar';
import { HeroPerimeterCanvas } from './HeroPerimeterCanvas';
import { ArchitectureSection } from './ArchitectureSection';
import { ThreatFlowSection } from './ThreatFlowSection';
import { BenchmarksSection } from './BenchmarksSection';
import { ForensicReplaySection } from './ForensicReplaySection';
import { ComplianceSection } from './ComplianceSection';
import { FinalCtaSection } from './FinalCtaSection';
import { Footer } from './Footer';

export const LandingPage: React.FC = () => {
  // Initialize Lenis for smooth momentum scrolling
  useEffect(() => {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let animId: number;
    function raf(time: number) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }
    animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-[#FBFBFE] text-ink font-sans antialiased selection:bg-accent-blue-light selection:text-accent-blue relative overflow-x-hidden min-h-screen">
      {/* Ambient Light Gradients matching Stitch */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[580px] bg-gradient-to-b from-sky-100/40 via-blue-50/20 to-transparent rounded-full blur-3xl opacity-75" />
        <div className="absolute top-[1300px] -left-40 w-[650px] h-[650px] bg-gradient-to-tr from-emerald-50/30 via-sky-50/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-6"
            >
              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-ink leading-[1.1]">
                Secure <span className="text-accent-blue">every decision</span> your AI agent makes.
              </h1>

              {/* Reduced Supporting Copy */}
              <p className="text-lg text-ink-muted leading-relaxed font-normal max-w-xl">
                Protect tool-using AI agents from malicious context and unsafe actions before execution.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-ink text-white font-semibold text-base shadow-card hover:bg-slate-800 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg border border-slate-800 active:translate-y-0"
                  href="https://sentinel-cu-hackathon.streamlit.app/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>Launch Dashboard</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>

                <a
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-ink font-semibold text-base shadow-subtle hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5 border border-slate-200"
                  href="#architecture"
                >
                  <span>Explore Architecture ↓</span>
                </a>
              </div>

              {/* Trust Subline */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono tracking-wider font-semibold text-ink-subtle">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                  <span>CONTENT FIREWALL</span>
                </div>
                <span className="text-slate-300">·</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>ACTION GUARD</span>
                </div>
                <span className="text-slate-300">·</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>FORENSIC AUDIT</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Right Column: High-End Security Perimeter Canvas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex justify-center"
            >
              <HeroPerimeterCanvas />
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROBLEM STATEMENT SECTION (Typography-only, purposeful whitespace & weight) */}
      <section className="py-24 bg-white border-y border-slate-200/80 relative z-20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl md:text-2xl font-normal text-ink-subtle"
          >
            AI agents don't just generate text.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl md:text-3xl font-medium text-ink-muted"
          >
            They read files. Search the web. Send emails. Modify records.
          </motion.p>
          <div className="h-px w-20 bg-accent-blue/40 mx-auto my-3" />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink"
          >
            Every tool call is an attack surface.
          </motion.p>
        </div>
      </section>

      {/* ARCHITECTURE SECTION */}
      <ArchitectureSection />

      {/* THREAT FLOW SIMULATOR */}
      <ThreatFlowSection />

      {/* BENCHMARKS */}
      <BenchmarksSection />

      {/* FORENSIC REPLAY SECTION */}
      <ForensicReplaySection />

      {/* COMPLIANCE STRIP */}
      <ComplianceSection />

      {/* FINAL CALL TO ACTION */}
      <FinalCtaSection />

      {/* MINIMAL FOOTER */}
      <Footer />
    </div>
  );
};
