import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Zap } from 'lucide-react';

interface MetricItem {
  id: string;
  targetValue: number;
  decimals: number;
  suffix: string;
  suffixClass: string;
  label: string;
  description: string;
}

const METRICS: MetricItem[] = [
  {
    id: 'accuracy',
    targetValue: 95.8,
    decimals: 1,
    suffix: '%',
    suffixClass: 'text-accent-blue text-4xl ml-1 font-sans',
    label: 'Defense Accuracy',
    description: 'Across 48 adversarial prompt injection benchmark datasets',
  },
  {
    id: 'block-rate',
    targetValue: 97.0,
    decimals: 1,
    suffix: '%',
    suffixClass: 'text-emerald-600 text-4xl ml-1 font-sans',
    label: 'Attack Block Rate',
    description: 'Pre-flight interception before tool execution',
  },
  {
    id: 'canary-leakage',
    targetValue: 0.0,
    decimals: 0,
    suffix: '%',
    suffixClass: 'text-emerald-600 text-4xl ml-1 font-sans',
    label: 'Canary Leakage',
    description: 'Zero sensitive data exfiltration in production stress tests',
  },
  {
    id: 'latency',
    targetValue: 1.36,
    decimals: 2,
    suffix: 'ms',
    suffixClass: 'text-accent-blue text-3xl ml-1 font-mono',
    label: 'Heuristic Latency',
    description: 'Average inspection delay across all pipeline stages',
  },
];

export const BenchmarksSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    accuracy: 0,
    'block-rate': 0,
    'canary-leakage': 0,
    latency: 0,
  });

  useEffect(() => {
    if (!isInView) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const finalCounts: { [key: string]: number } = {};
      METRICS.forEach((m) => {
        finalCounts[m.id] = m.targetValue;
      });
      setCounts(finalCounts);
      return;
    }

    const duration = 1200; // ms
    const startTime = performance.now();

    const animateCounts = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const nextCounts: { [key: string]: number } = {};
      METRICS.forEach((m) => {
        nextCounts[m.id] = m.targetValue * easeProgress;
      });
      setCounts(nextCounts);

      if (progress < 1) {
        requestAnimationFrame(animateCounts);
      }
    };

    requestAnimationFrame(animateCounts);
  }, [isInView]);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 relative z-10 bg-[#FBFBFE]" id="benchmarks">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl space-y-2 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono font-medium text-ink-subtle mb-1 shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-accent-blue" />
            <span>EMPIRICAL BENCHMARKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
            Security you can measure.
          </h2>
          <p className="text-lg text-ink-muted">
            48 adversarial scenarios evaluated against industry-standard autonomous agent benchmarks.
          </p>
        </div>

        {/* 4 Massive Editorial Typography Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {METRICS.map((metric) => {
            const formatted =
              metric.decimals === 0
                ? Math.round(counts[metric.id]).toString()
                : counts[metric.id].toFixed(metric.decimals);

            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="py-6 border-t border-slate-200 space-y-3 group"
              >
                <div className="text-6xl lg:text-7xl font-extrabold text-ink font-mono tracking-tight flex items-baseline select-none">
                  <span>{formatted}</span>
                  <span className={metric.suffixClass}>{metric.suffix}</span>
                </div>

                <div className="text-sm font-semibold text-ink uppercase tracking-wider font-mono flex items-center justify-between">
                  <span>{metric.label}</span>
                </div>

                <p className="text-xs text-ink-muted leading-relaxed font-sans">
                  {metric.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
