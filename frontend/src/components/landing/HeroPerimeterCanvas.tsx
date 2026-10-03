import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface HeroPerimeterCanvasProps {
  className?: string;
}

export const HeroPerimeterCanvas: React.FC<HeroPerimeterCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [threatBadge, setThreatBadge] = useState<{ visible: boolean; label: string }>({
    visible: false,
    label: 'PROMPT INJECTION',
  });
  const [activeThreatCount, setActiveThreatCount] = useState<number>(0);

  const threatLabels = [
    'BLOCKED',
    'PROMPT INJECTION',
    'SCOPE VIOLATION',
    'CANARY DETECTED',
  ];

  // Ref to hold trigger function so button can invoke it
  const triggerBurstRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animId = 0;
    let isVisible = true;
    let perimeterFlashAlpha = 0;
    let pulseTick = 0;
    let lastToastTime = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Spark particle on packet interception
    class Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const spd = 0.6 + Math.random() * 2.0;
        this.vx = Math.cos(angle) * spd;
        this.vy = Math.sin(angle) * spd;
        this.alpha = 1.0;
        this.decay = 0.04 + Math.random() * 0.04;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw(c: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return;
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, 1.8, 0, Math.PI * 2);
        c.fillStyle = `rgba(239, 68, 68, ${this.alpha})`;
        c.fill();
        c.restore();
      }
    }

    let sparks: Spark[] = [];

    function triggerToast(label?: string) {
      const now = Date.now();
      if (now - lastToastTime < 1300) return;
      lastToastTime = now;
      perimeterFlashAlpha = 0.9;

      const randomLabel = label || threatLabels[Math.floor(Math.random() * threatLabels.length)];
      setThreatBadge({ visible: true, label: randomLabel });
      setActiveThreatCount((c) => c + 1);

      setTimeout(() => {
        setThreatBadge((prev) => ({ ...prev, visible: false }));
      }, 1600);
    }

    class PacketParticle {
      x = 0;
      y = 0;
      isMalicious = false;
      speed = 1;
      radius = 2.5;
      intercepted = false;
      dissolve = 1.0;
      isEmerald = false;
      curvedWobble = 0;
      angle = 0;

      constructor(forceMalicious = false) {
        this.reset(forceMalicious);
      }

      reset(forceMalicious = false) {
        this.angle = Math.random() * Math.PI * 2;
        const spawnDist = (width / 2) * (0.92 + Math.random() * 0.12);
        this.x = width / 2 + Math.cos(this.angle) * spawnDist;
        this.y = height / 2 + Math.sin(this.angle) * spawnDist;
        this.isMalicious = forceMalicious || Math.random() < 0.22;
        this.speed = this.isMalicious ? 0.75 + Math.random() * 0.5 : 0.95 + Math.random() * 0.7;
        this.radius = this.isMalicious ? 3.4 : 2.5;
        this.intercepted = false;
        this.dissolve = 1.0;
        this.isEmerald = Math.random() > 0.5;
        this.curvedWobble = (Math.random() - 0.5) * 0.02;
      }

      update() {
        const cx = width / 2;
        const cy = height / 2;
        const dx = cx - this.x;
        const dy = cy - this.y;
        const dist = Math.hypot(dx, dy);

        const outerLayerR = width * 0.40; // LAYER 02 · ACTION GUARD
        const innerLayerR = width * 0.25; // LAYER 01 · CONTENT FIREWALL

        if (this.isMalicious && !this.intercepted) {
          // Intercepted at Layer 1 or Layer 2
          const targetRadius = this.radius > 3.0 ? innerLayerR : outerLayerR;
          if (dist <= targetRadius + 10) {
            this.intercepted = true;
            triggerToast(targetRadius === outerLayerR ? 'SCOPE VIOLATION BLOCKED' : 'PROMPT INJECTION DETECTED');
            for (let i = 0; i < 7; i++) {
              sparks.push(new Spark(this.x, this.y));
            }
          }
        }

        if (this.intercepted) {
          this.dissolve -= 0.055;
          this.radius *= 0.93;
          if (this.dissolve <= 0) {
            this.reset(false);
          }
          return;
        }

        if (dist <= 32) {
          this.reset(false);
          return;
        }

        const normDx = dx / dist;
        const normDy = dy / dist;
        const perpX = -normDy * this.curvedWobble;
        const perpY = normDx * this.curvedWobble;

        this.x += (normDx + perpX) * this.speed;
        this.y += (normDy + perpY) * this.speed;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        if (this.isMalicious) {
          c.fillStyle = `rgba(239, 68, 68, ${this.dissolve})`;
          c.shadowColor = 'rgba(239, 68, 68, 0.75)';
          c.shadowBlur = 8;
        } else {
          if (this.isEmerald) {
            c.fillStyle = `rgba(16, 185, 129, ${this.dissolve * 0.95})`;
            c.shadowColor = 'rgba(16, 185, 129, 0.45)';
          } else {
            c.fillStyle = `rgba(2, 132, 199, ${this.dissolve * 0.95})`;
            c.shadowColor = 'rgba(2, 132, 199, 0.55)';
          }
          c.shadowBlur = 6;
        }
        c.fill();
        c.restore();
      }
    }

    let packets: PacketParticle[] = [];

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Re-initialize packets based on canvas size
      if (packets.length === 0) {
        packets = Array.from({ length: 44 }, () => new PacketParticle());
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    triggerBurstRef.current = () => {
      for (let i = 0; i < 6; i++) {
        packets.push(new PacketParticle(true));
      }
      triggerToast('PROMPT INJECTION DETECTED');
    };

    // IntersectionObserver to pause rendering when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const outerR = width * 0.40; // LAYER 02
      const innerR = width * 0.25; // LAYER 01
      pulseTick += 0.02;

      // Handle perimeter flash decay
      if (perimeterFlashAlpha > 0) {
        perimeterFlashAlpha -= 0.02;
        if (perimeterFlashAlpha < 0) perimeterFlashAlpha = 0;
      }

      // 1. Outer Ring: LAYER 02 · ACTION GUARD
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
      ctx.strokeStyle =
        perimeterFlashAlpha > 0
          ? `rgba(239, 68, 68, ${0.35 + perimeterFlashAlpha * 0.5})`
          : 'rgba(2, 132, 199, 0.25)';
      ctx.lineWidth = perimeterFlashAlpha > 0 ? 1.5 : 1;
      ctx.setLineDash([5, 6]);
      ctx.stroke();

      ctx.font = '500 10px "JetBrains Mono", "Geist Mono", monospace';
      ctx.fillStyle = perimeterFlashAlpha > 0 ? '#ef4444' : '#0284c7';
      ctx.textAlign = 'center';
      ctx.fillText('LAYER 02 · ACTION GUARD', cx, cy - outerR - 8);
      ctx.restore();

      // 2. Inner Ring: LAYER 01 · CONTENT FIREWALL
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.strokeStyle =
        perimeterFlashAlpha > 0
          ? `rgba(239, 68, 68, ${0.45 + perimeterFlashAlpha * 0.55})`
          : 'rgba(16, 185, 129, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 4]);
      ctx.stroke();

      ctx.font = '500 10px "JetBrains Mono", "Geist Mono", monospace';
      ctx.fillStyle = '#10b981';
      ctx.textAlign = 'center';
      ctx.fillText('LAYER 01 · CONTENT FIREWALL', cx, cy - innerR - 8);
      ctx.restore();

      // 3. Central Node: AI AGENT with Soft Halo & Heartbeat
      ctx.save();
      const radialGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 56);
      radialGlow.addColorStop(0, 'rgba(2, 132, 199, 0.20)');
      radialGlow.addColorStop(1, 'rgba(2, 132, 199, 0)');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 56, 0, Math.PI * 2);
      ctx.fill();

      // Core agent circle
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.fillStyle = '#0B0F19';
      ctx.shadowColor = 'rgba(2, 132, 199, 0.4)';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Heartbeat pulse dot
      const heartPulse = prefersReducedMotion ? 2.0 : 1.8 + Math.sin(pulseTick * 3) * 0.6;
      ctx.beginPath();
      ctx.arc(cx, cy - 10, heartPulse, 0, Math.PI * 2);
      ctx.fillStyle = '#34D399';
      ctx.shadowColor = '#34D399';
      ctx.shadowBlur = 5;
      ctx.fill();

      // AI AGENT label
      ctx.font = 'bold 9px "JetBrains Mono", "Geist Mono", monospace';
      ctx.fillStyle = '#E0F2FE';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AI AGENT', cx, cy + 6);
      ctx.restore();

      // 4. Update and draw sparks
      sparks = sparks.filter((s) => s.alpha > 0);
      sparks.forEach((s) => {
        if (!prefersReducedMotion) s.update();
        s.draw(ctx);
      });

      // 5. Update and draw packets
      packets.forEach((p) => {
        if (!prefersReducedMotion) p.update();
        p.draw(ctx);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-square rounded-2xl glass-panel p-2 sm:p-4 shadow-card border border-slate-200/90 overflow-hidden flex items-center justify-center bg-white/85 ${className}`}
    >
      {/* Technical subtle grid overlay matching Stitch */}
      <div className="absolute inset-0 bg-tech-grid opacity-60 pointer-events-none" />

      {/* HTML5 Canvas for Living Particle System & Concentric Perimeters */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />

      {/* Concentric Layer Indicators (Top Left) */}
      <div className="absolute top-5 left-5 z-20 pointer-events-none">
        <span className="text-[10px] font-mono uppercase text-ink-subtle tracking-wider bg-white/90 px-3 py-1.5 rounded-lg border border-slate-200/90 shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
          Perimeter: Active Dual-Layer Defense
        </span>
      </div>

      {/* Floating Threat Telemetry Badge (Top Right) */}
      <div
        className={`absolute top-5 right-5 z-20 transition-all duration-300 pointer-events-none ${
          threatBadge.visible
            ? 'opacity-100 transform translate-y-0 scale-100'
            : 'opacity-0 transform translate-y-2 scale-95'
        }`}
      >
        <div className="px-3.5 py-1.5 rounded-full bg-red-50/95 border border-red-200 shadow-subtle flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-[11px] font-mono font-bold text-red-700 uppercase tracking-tight">
            {threatBadge.label}
          </span>
        </div>
      </div>

      {/* Interactive Threat Trigger Control (Bottom) */}
      <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/95 border border-slate-200 shadow-subtle backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-semibold text-ink">ACTIVE DEFENSE MESH</span>
          {activeThreatCount > 0 && (
            <span className="hidden sm:inline-flex text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
              {activeThreatCount} blocked
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => triggerBurstRef.current?.()}
          className="text-[11px] font-mono px-3.5 py-1.5 rounded-lg bg-slate-50 hover:bg-red-50 hover:text-red-700 text-slate-700 font-semibold border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer hover:border-red-200 active:scale-95 shadow-sm"
          title="Click to simulate an adversarial injection attempt"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          <span>Inject Threat</span>
        </button>
      </div>
    </div>
  );
};
