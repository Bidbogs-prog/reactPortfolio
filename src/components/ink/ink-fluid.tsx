import { useEffect, useRef, useState } from "react";
import { useRegister } from "@/lib/register";
import { useMotionTier, whenIdle } from "@/lib/motion/tier";
import { inkTheme, hslTripleToRgb } from "@/lib/motion/ink-theme";
import { InkBlots } from "./ink-blots";
import type { FluidSim } from "./three/fluid-sim";
import { cn } from "@/lib/utils";

interface InkFluidProps {
  className?: string;
  /** Overall ink strength, 0..1. */
  intensity?: number;
  /** Spontaneous drops while idle. */
  idleDrops?: boolean;
  /** Where the first drop lands (0..1 of the canvas, y down). */
  firstDrop?: { x: number; y: number } | null;
  /** Simulation resolution scale for cheaper secondary instances. */
  quality?: "high" | "low";
}

/**
 * The hero's ink: a WebGL fluid on the full tier (loaded lazily once the
 * browser is idle, paused when off-screen) and the 2D blot canvas on lite
 * and off. The pointer stirs the ink; idle drops keep it alive.
 */
export function InkFluid({
  className,
  intensity = 1,
  idleDrops = true,
  firstDrop = { x: 0.62, y: 0.42 },
  quality = "high",
}: InkFluidProps) {
  const tier = useMotionTier();
  const { register } = useRegister();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<FluidSim | null>(null);
  const [ready, setReady] = useState(false);

  // Create / destroy the simulation.
  useEffect(() => {
    if (tier !== "full") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let sim: FluidSim | null = null;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let idleTimer = 0;
    const cleanups: (() => void)[] = [];

    const cancelIdle = whenIdle(() => {
      import("./three/fluid-sim").then(({ FluidSim: Ctor }) => {
        if (cancelled) return;
        const theme = inkTheme(register);
        try {
          sim = new Ctor(canvas, {
            ...theme.fluid,
            accent: hslTripleToRgb(theme.accent),
            intensity,
            pressureIterations: quality === "high" ? 18 : 10,
          });
        } catch {
          return; // no WebGL after all; the canvas just stays empty
        }
        simRef.current = sim;
        setReady(true);

        const loop = (now: number) => {
          const dt = (now - last) / 1000;
          last = now;
          if (visible && !document.hidden && sim) sim.render(dt);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        // The first drop lands where the headline sits.
        if (firstDrop) {
          window.setTimeout(() => sim?.drop(firstDrop.x, 1 - firstDrop.y, 1.3), 500);
        }

        const scheduleIdle = () => {
          window.clearTimeout(idleTimer);
          idleTimer = window.setTimeout(() => {
            if (visible && sim) {
              sim.drop(0.1 + Math.random() * 0.8, 0.15 + Math.random() * 0.7, 0.6 + Math.random() * 0.6);
            }
            scheduleIdle();
          }, inkTheme(register).fluid.dropEvery * 1000 * (0.7 + Math.random() * 0.6));
        };
        if (idleDrops) scheduleIdle();

        // Pointer: stir the ink.
        let px = -1;
        let py = -1;
        const onMove = (e: PointerEvent) => {
          if (!sim) return;
          const rect = canvas.getBoundingClientRect();
          if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
          ) {
            px = py = -1;
            return;
          }
          const x = (e.clientX - rect.left) / rect.width;
          const y = 1 - (e.clientY - rect.top) / rect.height;
          if (px >= 0) {
            const dx = (x - px) * rect.width * 6;
            const dy = (y - py) * rect.height * 6;
            const speed = Math.hypot(dx, dy);
            sim.splat(x, y, dx, dy, Math.min(0.35, speed / 900));
          }
          px = x;
          py = y;
        };
        const onDown = (e: PointerEvent) => {
          if (!sim) return;
          const rect = canvas.getBoundingClientRect();
          if (e.clientY < rect.top || e.clientY > rect.bottom) return;
          sim.drop((e.clientX - rect.left) / rect.width, 1 - (e.clientY - rect.top) / rect.height, 0.9);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerdown", onDown, { passive: true });
        cleanups.push(() => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerdown", onDown);
        });

        const io = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
        });
        io.observe(canvas);
        cleanups.push(() => io.disconnect());

        const ro = new ResizeObserver(() => sim?.resize());
        ro.observe(canvas);
        cleanups.push(() => ro.disconnect());
      });
    });

    return () => {
      cancelled = true;
      cancelIdle();
      cancelAnimationFrame(raf);
      window.clearTimeout(idleTimer);
      cleanups.forEach((c) => c());
      sim?.dispose();
      simRef.current = null;
      setReady(false);
    };
    // Register changes are handled by the params effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier, quality, idleDrops, intensity]);

  // Register switch: re-tune the ink without restarting the simulation.
  useEffect(() => {
    const sim = simRef.current;
    if (!sim) return;
    const theme = inkTheme(register);
    sim.setParams({ ...theme.fluid, accent: hslTripleToRgb(theme.accent), intensity });
    sim.drop(0.5, 0.5, 1.2);
  }, [register, intensity, ready]);

  if (tier !== "full") {
    return <InkBlots className={className} intensity={intensity} />;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none block", className)}
      style={{ opacity: ready ? 1 : 0, transition: "opacity 0.8s ease" }}
    />
  );
}
