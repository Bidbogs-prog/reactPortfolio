import { useEffect, useRef } from "react";
import { useMotionTier } from "./tier";

export interface InkRevealOptions {
  /** Stagger between direct children (seconds). 0 reveals the node itself. */
  stagger?: number;
  /** Slide distance in px. */
  y?: number;
  /** Delay in seconds. */
  delay?: number;
  /** ScrollTrigger start. */
  start?: string;
  /** Selector for the children to stagger; defaults to direct children. */
  selector?: string;
}

/**
 * Scroll reveal for the ink system. On the full tier it's a GSAP
 * ScrollTrigger tween (clip + slide, feels like ink surfacing through
 * paper). On lite/off it hands the node the `reveal` / `is-visible`
 * classes so the existing CSS path takes over (or shows it immediately).
 */
export function useInkReveal<T extends HTMLElement = HTMLDivElement>(
  opts: InkRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const tier = useMotionTier();
  const { stagger = 0, y = 28, delay = 0, start = "top 85%", selector } = opts;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (tier !== "full") {
      // CSS path. `off` reveals instantly via the reduced-motion rules.
      const targets: HTMLElement[] =
        stagger > 0
          ? (Array.from(
              selector ? node.querySelectorAll(selector) : node.children
            ) as HTMLElement[])
          : [node];
      targets.forEach((el, i) => {
        el.classList.add("reveal");
        el.style.setProperty("--reveal-delay", `${Math.round((delay + i * stagger) * 1000)}ms`);
      });
      // Undo on re-run: the tier may upgrade to "full" after first paint.
      const undo = () =>
        targets.forEach((el) => {
          el.classList.remove("reveal", "is-visible");
          el.style.removeProperty("--reveal-delay");
        });
      if (tier === "off") {
        targets.forEach((el) => el.classList.add("is-visible"));
        return undo;
      }
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              (e.target as HTMLElement).classList.add("is-visible");
              io.unobserve(e.target);
            }
          }
        },
        { threshold: 0.12 }
      );
      targets.forEach((el) => io.observe(el));
      return () => {
        io.disconnect();
        undo();
      };
    }

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    import("./gsap").then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const targets =
          stagger > 0
            ? Array.from(selector ? node.querySelectorAll(selector) : node.children)
            : [node];
        gsap.fromTo(
          targets,
          { y, autoAlpha: 0, clipPath: "inset(0 0 100% 0)" },
          {
            y: 0,
            autoAlpha: 1,
            clipPath: "inset(0 0 -20% 0)",
            duration: 1.1,
            ease: "expo.out",
            stagger,
            delay,
            clearProps: "clipPath",
            scrollTrigger: { trigger: node, start, once: true },
          }
        );
      }, node);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [tier, stagger, y, delay, start, selector]);

  return ref;
}
