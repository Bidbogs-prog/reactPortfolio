import { useEffect, useMemo, useRef, type ElementType } from "react";
import { useRegister } from "@/lib/register";
import { useMotionTier } from "@/lib/motion/tier";
import { cn } from "@/lib/utils";

interface InkHeadlineProps {
  /**
   * The headline. `\n` forces a line break; `*word*` inks the word in the
   * accent colour.
   */
  text: string;
  as?: ElementType;
  className?: string;
  /** Extra class per line, by index (e.g. to indent the second line). */
  lineClassName?: (index: number) => string | undefined;
  /** "mount": pour in on first paint (hero). "scroll": pour in when seen. */
  trigger?: "mount" | "scroll";
  /** Seconds before the pour starts. */
  delay?: number;
  /** Seconds between adjacent characters. */
  stagger?: number;
  id?: string;
}

interface Token {
  word: string;
  accent: boolean;
}

function tokenize(line: string): Token[] {
  const out: Token[] = [];
  const re = /\*([^*]+)\*|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1] !== undefined) out.push({ word: m[1], accent: true });
    else out.push({ word: m[2], accent: false });
  }
  return out;
}

/**
 * A headline that pours in as ink. Every character is real text, outlined
 * from the very first frame (so it's painted and counts as the LCP), then
 * fills: engineer pours left-to-right with a hard edge, poet blooms out
 * from each glyph's centre. Full tier tweens `--fill` with GSAP; lite runs
 * the same fill as a CSS keyframe; off renders filled.
 */
export function InkHeadline({
  text,
  as: Tag = "h1",
  className,
  lineClassName,
  trigger = "scroll",
  delay = 0,
  stagger = 0.028,
  id,
}: InkHeadlineProps) {
  const { register } = useRegister();
  const tier = useMotionTier();
  const ref = useRef<HTMLElement>(null);
  const mode = register === "poet" ? "bloom" : "pour";

  const lines = useMemo(() => text.split("\n").map(tokenize), [text]);
  const plain = useMemo(() => text.replace(/\*/g, ""), [text]);
  let charIndex = 0;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const chars = Array.from(node.querySelectorAll<HTMLElement>(".ink-char"));

    if (tier === "off") {
      node.classList.add("is-inked");
      return;
    }

    if (tier !== "full") {
      if (trigger === "mount") {
        node.classList.add("is-inked");
        return;
      }
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            node.classList.add("is-inked");
            io.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      io.observe(node);
      return () => io.disconnect();
    }

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    import("@/lib/motion/gsap").then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        node.classList.add("is-gsap");
        gsap.set(chars, { "--fill": 0 });
        gsap.to(chars, {
          "--fill": 1,
          duration: mode === "bloom" ? 1.4 : 0.9,
          ease: mode === "bloom" ? "power2.inOut" : "expo.out",
          stagger: { each: stagger, from: mode === "bloom" ? "random" : "start" },
          delay,
          scrollTrigger:
            trigger === "scroll"
              ? { trigger: node, start: "top 85%", once: true }
              : undefined,
        });
      }, node);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [tier, trigger, delay, stagger, mode, text]);

  return (
    <Tag
      ref={ref}
      id={id}
      className={cn("ink-headline", className)}
      data-ink={mode}
      aria-label={plain}
    >
      {lines.map((tokens, li) => (
        <span
          key={li}
          className={cn("ink-line block", lineClassName?.(li))}
          aria-hidden="true"
        >
          {tokens.map((t, wi) => (
            <span key={wi}>
              <span className={cn("ink-word", t.accent && "accent")}>
                {Array.from(t.word).map((ch, ci) => {
                  const i = charIndex++;
                  return (
                    <span key={ci} className="ink-char" style={{ ["--i" as string]: i }}>
                      {ch}
                    </span>
                  );
                })}
              </span>
              {wi < tokens.length - 1 ? " " : null}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
