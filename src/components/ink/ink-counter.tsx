import { useEffect, useRef } from "react";
import { useMotionTier } from "@/lib/motion/tier";
import { cn } from "@/lib/utils";

/**
 * A fact value. Numeric prefixes count up when scrolled into view (full
 * tier); "∞" is drawn as an ink lemniscate; anything else renders as-is.
 */
export function InkCounter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const tier = useMotionTier();
  const match = value.match(/^(\d+)(.*)$/);
  const isInfinity = value === "∞";

  useEffect(() => {
    const node = ref.current;
    if (!node || tier !== "full") return;
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    import("@/lib/motion/gsap").then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        if (isInfinity) {
          const path = node.querySelector("path");
          if (path) {
            gsap.fromTo(
              path,
              { drawSVG: "0%" },
              {
                drawSVG: "100%",
                duration: 1.6,
                ease: "power2.inOut",
                scrollTrigger: { trigger: node, start: "top 90%", once: true },
              }
            );
          }
          return;
        }
        if (!match) return;
        const target = Number(match[1]);
        const digits = node.querySelector<HTMLElement>(".digits");
        if (!digits) return;
        const obj = { n: 0 };
        gsap.to(obj, {
          n: target,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 90%", once: true },
          onUpdate: () => {
            digits.textContent = String(Math.round(obj.n));
          },
        });
      }, node);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [tier, isInfinity, match]);

  if (isInfinity) {
    return (
      <span ref={ref} className={cn("inline-block", className)} aria-label="infinity">
        <svg viewBox="0 0 64 32" className="inline-block h-[0.8em] w-auto" aria-hidden="true">
          <path
            className="ink-lemniscate"
            d="M32 16 C 26 4, 8 4, 8 16 C 8 28, 26 28, 32 16 C 38 4, 56 4, 56 16 C 56 28, 38 28, 32 16 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }

  if (!match) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      <span className="digits">{match[1]}</span>
      {match[2]}
    </span>
  );
}
