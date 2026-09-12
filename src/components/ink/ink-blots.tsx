import { useEffect, useRef } from "react";
import { useRegister } from "@/lib/register";
import { useMotionTier } from "@/lib/motion/tier";
import { inkTheme } from "@/lib/motion/ink-theme";
import { cn } from "@/lib/utils";

interface Blot {
  x: number;
  y: number;
  r: number;
  target: number;
  born: number;
  life: number;
  seed: number;
}

interface InkBlotsProps {
  className?: string;
  /** 0..1 overall opacity of the ink. */
  intensity?: number;
  /** Add a blot on touch/click. */
  interactive?: boolean;
  /** Seconds between spontaneous blots. */
  every?: number;
}

/**
 * The lite-tier ink: a 2D canvas of blots that swell and fade, merged into
 * goo by the #ink-blob filter on the wrapper. Engineer blots are squarish
 * and snap to the grid; poet blots are round and bloom slowly. On the off
 * tier it paints a few blots once and stops.
 */
export function InkBlots({ className, intensity = 1, interactive = true, every = 3.2 }: InkBlotsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { register } = useRegister();
  const tier = useMotionTier();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const theme = inkTheme(register);
    const poet = register === "poet";
    const isStatic = tier === "off";

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let sinceBlot = 0;
    const blots: Blot[] = [];
    const grid = 56;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const add = (x: number, y: number, scale = 1) => {
      if (!poet) {
        x = Math.round(x / grid) * grid;
        y = Math.round(y / grid) * grid;
      }
      const base = Math.min(w, h) * (poet ? 0.11 : 0.07) * scale;
      blots.push({
        x,
        y,
        r: 0,
        target: base * (0.7 + Math.random() * 0.8) * theme.blots.growth,
        born: performance.now(),
        life: (poet ? 9000 : 6000) * (0.8 + Math.random() * 0.6),
        seed: Math.random() * Math.PI * 2,
      });
      if (blots.length > theme.blots.count + 4) blots.shift();
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `hsl(${theme.accent} / ${0.9 * intensity})`;
      for (let i = blots.length - 1; i >= 0; i--) {
        const b = blots[i];
        const age = (now - b.born) / b.life;
        if (age >= 1) {
          blots.splice(i, 1);
          continue;
        }
        // Swell fast, hold, then shrink away.
        const grow = poet ? 1 - Math.pow(1 - Math.min(age * 2.2, 1), 3) : Math.min(age * 4, 1);
        const fade = age > 0.65 ? 1 - (age - 0.65) / 0.35 : 1;
        b.r = b.target * grow * fade;
        if (b.r < 0.5) continue;
        ctx.beginPath();
        if (poet) {
          // Slightly wobbly circle
          const pts = 18;
          for (let k = 0; k <= pts; k++) {
            const a = (k / pts) * Math.PI * 2;
            const wob = 1 + 0.08 * Math.sin(a * 3 + b.seed + now * 0.0006);
            const px = b.x + Math.cos(a) * b.r * wob;
            const py = b.y + Math.sin(a) * b.r * wob;
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
        } else {
          // Blocky: a cross of grid-aligned rectangles
          const s = b.r;
          ctx.rect(b.x - s, b.y - s * 0.55, s * 2, s * 1.1);
          ctx.rect(b.x - s * 0.55, b.y - s, s * 1.1, s * 2);
        }
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      const dt = now - last;
      last = now;
      sinceBlot += dt;
      if (sinceBlot > every * 1000) {
        sinceBlot = 0;
        add(w * (0.1 + Math.random() * 0.8), h * (0.15 + Math.random() * 0.7));
      }
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    resize();
    // Seed a few so the canvas isn't empty on first paint.
    for (let i = 0; i < 3; i++) {
      add(w * (0.15 + Math.random() * 0.7), h * (0.2 + Math.random() * 0.6), 1.2);
      blots[blots.length - 1].born -= isStatic ? 2500 : 900 * i;
    }

    if (isStatic) {
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      add(e.clientX - rect.left, e.clientY - rect.top, 1.1);
    };
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    if (interactive && !isStatic) window.addEventListener("pointerdown", onPointer, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [register, tier, intensity, interactive, every]);

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
      style={{ filter: "url(#ink-blob)" }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
