import { useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}=+*^?#abcdefghijklmnopqrstuvwxyz0123456789";

interface ScrambleChar {
  to: string;
  start: number;
  end: number;
  cur: string;
}

/**
 * Animates a "decrypt" scramble from the previous string to `target` whenever
 * `target` changes. Returns the current display string. Honors reduced motion.
 */
export function useScramble(target: string): string {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = target;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(target);
      return;
    }

    const length = Math.max(from.length, target.length);
    const queue: ScrambleChar[] = Array.from({ length }, (_, i) => {
      const start = Math.floor(Math.random() * 30);
      const end = start + 10 + Math.floor(Math.random() * 30);
      return { to: target[i] ?? "", start, end, cur: from[i] ?? "" };
    });

    let frame = 0;

    const tick = () => {
      let out = "";
      let done = 0;
      for (const q of queue) {
        if (frame >= q.end) {
          done++;
          out += q.to;
        } else if (frame >= q.start) {
          if (!q.cur || Math.random() < 0.3) {
            q.cur = CHARS[Math.floor(Math.random() * CHARS.length)];
          }
          out += q.cur;
        } else {
          out += q.to ? q.cur : "";
        }
      }
      setDisplay(out);
      if (done === queue.length) {
        rafRef.current = null;
        return;
      }
      frame++;
      rafRef.current = requestAnimationFrame(tick);
    };

    tick();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  return display;
}
