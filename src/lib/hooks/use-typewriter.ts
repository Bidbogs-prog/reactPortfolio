import { useEffect, useState } from "react";

/**
 * Types out `text` character by character. Returns the visible substring and
 * whether typing has finished. Honors reduced motion (renders instantly).
 */
export function useTypewriter(text: string, speed = 14) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) window.clearInterval(timer);
    }, speed);
    return () => window.clearInterval(timer);
  }, [text, speed]);

  return { shown: text.slice(0, count), done: count >= text.length };
}
