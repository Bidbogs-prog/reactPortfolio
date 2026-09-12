import { useEffect, useMemo, useRef } from "react";
import { useRegister } from "@/lib/register";
import { useMotionTier } from "@/lib/motion/tier";
import { cn } from "@/lib/utils";

/**
 * The line between sections. Not a border: a hand-inked stroke whose edge
 * is displaced by turbulence. Engineer is a fine torn line (the section
 * frame adds plotter registration marks); poet is a wet line with ink drips that
 * lengthen as it scrolls past (full tier).
 */
export function InkDivider({ className }: { className?: string }) {
  const { register } = useRegister();
  const tier = useMotionTier();
  const ref = useRef<SVGSVGElement>(null);
  const poet = register === "poet";
  // Turbulence is CPU-rasterized: only on the full tier.
  const filtered = tier === "full";

  // Deterministic drip layout so SSR and client agree.
  const drips = useMemo(
    () =>
      [0.08, 0.19, 0.31, 0.47, 0.58, 0.72, 0.86, 0.94].map((x, i) => ({
        x,
        h: 14 + ((i * 37) % 26),
        w: 2 + ((i * 13) % 3),
      })),
    []
  );

  useEffect(() => {
    if (tier !== "full" || !ref.current || !poet) return;
    const svg = ref.current;
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    import("@/lib/motion/gsap").then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          svg.querySelectorAll<SVGRectElement>(".drip"),
          { scaleY: 0.15 },
          {
            scaleY: 1,
            transformOrigin: "50% 0%",
            ease: "none",
            stagger: 0.04,
            scrollTrigger: { trigger: svg, start: "top 90%", end: "top 30%", scrub: 1.2 },
          }
        );
      }, svg);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [tier, poet]);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      className={cn(
        "ink-divider pointer-events-none block w-full overflow-visible text-foreground",
        poet ? "h-12" : "h-6",
        className
      )}
      viewBox="0 0 1000 40"
      preserveAspectRatio="none"
    >
      {poet ? (
        <g style={filtered ? { filter: "url(#ink-bleed)" } : undefined}>
          <rect x="0" y="6" width="1000" height="2.2" fill="currentColor" opacity="0.55" />
          {drips.map((d, i) => (
            <rect
              key={i}
              className="drip"
              x={d.x * 1000}
              y="7"
              width={d.w}
              height={d.h}
              rx={d.w / 2}
              fill="currentColor"
              opacity="0.5"
            />
          ))}
        </g>
      ) : (
        <g>
          <rect
            x="0"
            y="12"
            width="1000"
            height="1.6"
            fill="currentColor"
            opacity="0.5"
            style={filtered ? { filter: "url(#ink-tear)" } : undefined}
          />
        </g>
      )}
    </svg>
  );
}
