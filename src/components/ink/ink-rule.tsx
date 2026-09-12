import { useEffect, useMemo, useRef } from "react";
import { useRegister } from "@/lib/register";
import { useMotionTier } from "@/lib/motion/tier";
import { cn } from "@/lib/utils";

/**
 * A hand-drawn horizontal rule: a slightly wobbly path that draws itself
 * left to right when scrolled into view (DrawSVG on full, CSS dash on
 * lite, finished on off). `seed` varies the wobble so no two are alike.
 */
export function InkRule({ className, seed = 1 }: { className?: string; seed?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const tier = useMotionTier();
  const { register } = useRegister();
  const poet = register === "poet";

  const d = useMemo(() => {
    // 8 segments with deterministic wobble
    let s = seed * 9301 + 49297;
    const rnd = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    const amp = poet ? 3.2 : 1.4;
    let path = `M0 6`;
    for (let i = 1; i <= 8; i++) {
      const x = (i / 8) * 1000;
      const y = 6 + (rnd() - 0.5) * amp * 2;
      const cx = x - 62 + (rnd() - 0.5) * 30;
      const cy = 6 + (rnd() - 0.5) * amp * 3;
      path += ` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return path;
  }, [seed, poet]);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const undo = () => svg.classList.remove("is-drawn", "is-static");
    if (tier === "off") {
      svg.classList.add("is-drawn", "is-static");
      return undo;
    }
    if (tier !== "full") {
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            svg.classList.add("is-drawn");
            io.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      io.observe(svg);
      return () => {
        io.disconnect();
        undo();
      };
    }
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    import("@/lib/motion/gsap").then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        svg.classList.add("is-gsap");
        gsap.fromTo(
          svg.querySelector("path"),
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration: poet ? 1.6 : 0.9,
            ease: poet ? "power2.inOut" : "expo.out",
            scrollTrigger: { trigger: svg, start: "top 92%", once: true },
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
      viewBox="0 0 1000 12"
      preserveAspectRatio="none"
      className={cn("ink-rule block h-3 w-full overflow-visible text-foreground", className)}
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={poet ? 1.6 : 1.3}
        strokeLinecap="round"
        opacity="0.45"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
