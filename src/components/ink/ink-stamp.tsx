import { useEffect, useRef, type ElementType, type AllHTMLAttributes, type ReactNode } from "react";
import { useRegister } from "@/lib/register";
import { useMotionTier } from "@/lib/motion/tier";
import { cn } from "@/lib/utils";

interface InkStampProps extends Omit<AllHTMLAttributes<HTMLElement>, "children" | "as"> {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Index used for a deterministic tilt and stagger. */
  index?: number;
  /** "rubber" | "seal" | "auto" (auto = engineer rubber, poet seal). */
  shape?: "rubber" | "seal" | "auto";
  /** Fill the stamp with accent ink instead of outlining it. */
  solid?: boolean;
}

/**
 * A tag rendered as an ink stamp. Engineer: rubber stamp, rectangular,
 * slightly crooked, ink-starved edges. Poet: wax seal, round-ish, soft.
 */
export function InkStamp({
  children,
  className,
  as: Tag = "span",
  index = 0,
  shape = "auto",
  solid = false,
  style,
  ...rest
}: InkStampProps) {
  const { register } = useRegister();
  const resolved = shape === "auto" ? (register === "poet" ? "seal" : "rubber") : shape;
  // -2.4deg .. 2.4deg, alternating, deterministic per index.
  const tilt = ((index * 7) % 5) - 2;
  return (
    <Tag
      className={cn("stamp", `stamp-${resolved}`, solid && "stamp-solid", className)}
      style={{ ["--tilt" as string]: `${tilt * 0.6}deg`, ["--i" as string]: index, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Wraps a set of stamps and stamps them in when scrolled into view: a quick
 * press with overshoot, staggered. Full tier uses GSAP; lite uses the CSS
 * keyframe; off shows them pressed.
 */
export function InkStampGroup({
  children,
  className,
  as: Tag = "ul",
  stagger = 0.045,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const tier = useMotionTier();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const stamps = Array.from(node.querySelectorAll<HTMLElement>(".stamp"));
    if (tier === "off") {
      stamps.forEach((s) => s.classList.add("is-pressed"));
      return;
    }
    if (tier !== "full") {
      stamps.forEach((s, i) => s.style.setProperty("--stamp-delay", `${Math.round(i * stagger * 1000)}ms`));
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            stamps.forEach((s) => s.classList.add("is-pressed"));
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
    import("@/lib/motion/gsap").then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        stamps.forEach((s) => s.classList.add("is-gsap"));
        gsap.fromTo(
          stamps,
          { scale: 1.7, autoAlpha: 0, rotate: () => `+=${(Math.random() - 0.5) * 12}` },
          {
            scale: 1,
            autoAlpha: 1,
            rotate: (_i, el) => (el as HTMLElement).style.getPropertyValue("--tilt"),
            duration: 0.5,
            ease: "back.out(2.4)",
            stagger,
            scrollTrigger: { trigger: node, start: "top 88%", once: true },
            onComplete: () => stamps.forEach((s) => s.classList.add("is-pressed")),
          }
        );
      }, node);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [tier, stagger]);

  return (
    <Tag ref={ref} className={cn("stamp-group", className)}>
      {children}
    </Tag>
  );
}
