import { useEffect, useRef } from "react";
import { useRegister } from "@/lib/register";
import { useMotionTier } from "@/lib/motion/tier";

/**
 * Reading progress for a writing post: an ink line in the left margin that
 * fills downward as you read. Engineer ends square; poet ends in a drop.
 * Full tier uses a ScrollTrigger scrub; lite listens to scroll; off is
 * static (no progress, nothing moves).
 */
export function InkProgress({ target }: { target: React.RefObject<HTMLElement> }) {
  const lineRef = useRef<HTMLSpanElement>(null);
  const tier = useMotionTier();
  const { register } = useRegister();
  const poet = register === "poet";

  useEffect(() => {
    const line = lineRef.current;
    const el = target.current;
    if (!line || !el || tier === "off") return;

    if (tier !== "full") {
      const onScroll = () => {
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight * 0.6;
        const p = Math.min(1, Math.max(0, (-r.top + window.innerHeight * 0.3) / Math.max(1, total)));
        line.style.setProperty("--p", p.toFixed(4));
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    import("@/lib/motion/gsap").then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          line,
          { "--p": 0 },
          {
            "--p": 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 30%", end: "bottom 60%", scrub: 0.6 },
          }
        );
      });
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [tier, target]);

  if (tier === "off") return null;

  return (
    <span
      ref={lineRef}
      aria-hidden="true"
      className="ink-progress pointer-events-none fixed left-4 top-[18vh] hidden h-[64vh] w-px lg:block xl:left-8"
      data-end={poet ? "drop" : "square"}
    />
  );
}
