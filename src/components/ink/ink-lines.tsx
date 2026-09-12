import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { useMotionTier } from "@/lib/motion/tier";
import { cn } from "@/lib/utils";

interface InkLinesProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** "mount" plays immediately; "scroll" waits until seen. */
  trigger?: "mount" | "scroll";
  delay?: number;
  stagger?: number;
}

/**
 * Paragraph text that rises line by line out of a mask, like ink drawn up
 * through paper. Full tier splits into lines with SplitText and tweens
 * them; lite/off fall back to the block-level `reveal` transition.
 */
export function InkLines({
  children,
  as: Tag = "p",
  className,
  trigger = "scroll",
  delay = 0,
  stagger = 0.08,
}: InkLinesProps) {
  const ref = useRef<HTMLElement>(null);
  const tier = useMotionTier();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (tier !== "full") {
      node.classList.add("reveal");
      node.style.setProperty("--reveal-delay", `${Math.round(delay * 1000)}ms`);
      if (tier === "off" || trigger === "mount") {
        node.classList.add("is-visible");
        return;
      }
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            node.classList.add("is-visible");
            io.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      io.observe(node);
      return () => io.disconnect();
    }

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    import("@/lib/motion/gsap").then(({ gsap, SplitText }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const split = SplitText.create(node, {
          type: "lines",
          mask: "lines",
          linesClass: "ink-line",
        });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1,
          ease: "expo.out",
          stagger,
          delay,
          scrollTrigger:
            trigger === "scroll" ? { trigger: node, start: "top 88%", once: true } : undefined,
        });
      }, node);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [tier, trigger, delay, stagger]);

  return (
    <Tag ref={ref} className={cn("ink-lines", className)}>
      {children}
    </Tag>
  );
}
