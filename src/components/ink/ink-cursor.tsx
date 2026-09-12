import { useEffect, useRef } from "react";
import { useRegister } from "@/lib/register";
import { useMotionTier } from "@/lib/motion/tier";
import { inkTheme } from "@/lib/motion/ink-theme";

/**
 * Custom cursor for the full tier: a nib (engineer, square) or a brush
 * (poet, round) that grows and inverts over interactive elements, plus a
 * short canvas trail of wet ink behind it. Never rendered on lite/off and
 * never intercepts pointer events.
 */
export function InkCursor() {
  const tier = useMotionTier();
  const { register } = useRegister();
  const dotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (tier !== "full") return;
    const dot = dotRef.current;
    const canvas = canvasRef.current;
    if (!dot || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const theme = inkTheme(register);
    const html = document.documentElement;
    html.classList.add("ink-cursor-on");

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    const trail: { x: number; y: number; a: number }[] = [];
    let hover = false;
    let visible = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        pos.x = target.x;
        pos.y = target.y;
        dot.style.opacity = "1";
      }
      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest(
        "a, button, [role=button], label, summary, [data-cursor=hover]"
      );
      const native = !!el?.closest("input, textarea, select, [data-cursor=native]");
      if (interactive !== hover) {
        hover = interactive;
        dot.classList.toggle("is-hover", hover);
      }
      dot.classList.toggle("is-native", native);
    };
    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
    };
    const onDown = () => dot.classList.add("is-down");
    const onUp = () => dot.classList.remove("is-down");

    const poet = register === "poet";
    const draw = () => {
      pos.x += (target.x - pos.x) * (poet ? 0.16 : 0.32);
      pos.y += (target.y - pos.y) * (poet ? 0.16 : 0.32);
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;

      if (visible) trail.push({ x: pos.x, y: pos.y, a: 1 });
      if (trail.length > (poet ? 26 : 14)) trail.shift();

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (trail.length > 1) {
        ctx.lineCap = poet ? "round" : "butt";
        ctx.lineJoin = poet ? "round" : "miter";
        for (let i = 1; i < trail.length; i++) {
          const t = i / trail.length;
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.lineTo(trail[i].x, trail[i].y);
          ctx.strokeStyle = `hsl(${theme.accent} / ${t * (poet ? 0.35 : 0.5)})`;
          ctx.lineWidth = poet ? 2 + t * 10 : 1 + t * 2;
          ctx.stroke();
        }
      }
      for (const p of trail) p.a *= 0.9;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove("ink-cursor-on");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, [tier, register]);

  if (tier !== "full") return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[95] h-full w-full"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="ink-cursor"
        data-shape={register === "poet" ? "brush" : "nib"}
        style={{ opacity: 0 }}
      />
    </>
  );
}
