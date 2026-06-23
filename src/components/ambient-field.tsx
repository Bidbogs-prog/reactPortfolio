import { useEffect, useRef } from "react";
import { useRegister } from "@/lib/register";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/**
 * A lightweight, dependency-free canvas of slowly drifting points with a faint
 * parallax response to the cursor. Recolors with the active register and goes
 * dormant under prefers-reduced-motion.
 */
export function AmbientField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { register } = useRegister();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Pull the accent hue straight from the active theme so it tracks register.
    const accent =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim() || "74 92% 60%";

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0.5, y: 0.5 };
    let particles: Particle[] = [];
    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(56, Math.floor((width * height) / 26000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.6 + 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const px = (mouse.x - 0.5) * 26;
      const py = (mouse.y - 0.5) * 26;

      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }
        const depth = p.r / 2.2;
        ctx.beginPath();
        ctx.arc(p.x + px * depth, p.y + py * depth, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${accent} / ${0.18 + depth * 0.22})`;
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    if (!reduced) window.addEventListener("mousemove", onMouse, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [register]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
    />
  );
}
