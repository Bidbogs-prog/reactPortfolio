import { useEffect, useRef, useState } from "react";

/**
 * Reveals an element once it scrolls into view. Returns a ref to attach and a
 * boolean indicating visibility. Disconnects after the first reveal so the
 * animation only plays once.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.15 }
) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect users who prefer no motion, reveal immediately.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible };
}
