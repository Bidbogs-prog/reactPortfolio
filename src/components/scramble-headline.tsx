import { useEffect, useRef, useState } from "react";

// Symbols each character cycles through before settling. Kept to narrow
// glyphs so cell widths barely change and the line never rewraps.
const SYMBOLS = "!/-_=+*#%?:•~";

interface Cell {
  ch: string;
  scrambling: boolean;
}

interface Plan {
  ch: string;
  isSpace: boolean;
  hold: number;
  delay: number;
  duration: number;
  symbols: string[];
}

const STAGGER = 22; // ms between adjacent characters starting — a gentle wave

function settled(text: string): Cell[] {
  return Array.from(text, (ch) => ({ ch, scrambling: false }));
}

/**
 * Decodes into `text` whenever it changes: every character stays in its own
 * position and flips through 2–3 random symbols before locking in, so the
 * string never changes length (no overflow). Scrambling characters carry the
 * `scramble-char` class. First render and reduced-motion are shown instantly.
 */
export function ScrambleHeadline({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [cells, setCells] = useState<Cell[]>(() => settled(text));
  const isFirst = useRef(true);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      setCells(settled(text));
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCells(settled(text));
      return;
    }

    const plan: Plan[] = Array.from(text, (ch, i) => {
      const isSpace = ch === " " || ch === "\n" || ch === "\t";
      const flips = 2 + Math.floor(Math.random() * 2); // 2 or 3 symbols
      const hold = 85 + Math.random() * 45; // ms each symbol is held
      const symbols = isSpace
        ? []
        : Array.from(
            { length: flips },
            () => SYMBOLS[(Math.random() * SYMBOLS.length) | 0]
          );
      return { ch, isSpace, hold, delay: i * STAGGER, duration: flips * hold, symbols };
    });

    const totalEnd = plan.reduce((m, p) => Math.max(m, p.delay + p.duration), 0);
    const start = performance.now();

    const tick = () => {
      const t = performance.now() - start;
      setCells(
        plan.map((p) => {
          if (p.isSpace) return { ch: p.ch, scrambling: false };
          const local = t - p.delay;
          if (local >= p.duration) return { ch: p.ch, scrambling: false };
          const idx =
            local < 0
              ? 0
              : Math.min(Math.floor(local / p.hold), p.symbols.length - 1);
          return { ch: p.symbols[idx], scrambling: true };
        })
      );

      if (t >= totalEnd) {
        setCells(settled(text));
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text]);

  return (
    <span className={className} aria-hidden="true">
      {cells.map((c, i) => (
        <span key={i} className={c.scrambling ? "scramble-char" : undefined}>
          {c.ch}
        </span>
      ))}
    </span>
  );
}
