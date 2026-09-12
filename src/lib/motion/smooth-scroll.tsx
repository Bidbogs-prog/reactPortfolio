import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type Lenis from "lenis";
import { useMotionTier } from "./tier";

interface SmoothScrollValue {
  /** Scroll to an element id or a pixel offset, smooth where supported. */
  scrollTo: (target: string | number, opts?: { immediate?: boolean }) => void;
  getLenis: () => Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollValue>({
  scrollTo: (target) => {
    if (typeof document === "undefined") return;
    if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
    else document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
  },
  getLenis: () => null,
});

/**
 * Lenis smooth scrolling on the full tier only, kept in step with GSAP's
 * ticker and ScrollTrigger. On lite/off it's a no-op provider whose
 * `scrollTo` falls back to native scrolling, so callers never branch.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const tier = useMotionTier();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (tier !== "full") return;
    let cancelled = false;
    let cleanup = () => {};

    Promise.all([import("lenis"), import("./gsap")]).then(
      ([{ default: LenisCtor }, { gsap, ScrollTrigger }]) => {
        if (cancelled) return;
        const lenis = new LenisCtor({
          lerp: 0.09,
          wheelMultiplier: 0.95,
          smoothWheel: true,
        });
        lenisRef.current = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        document.documentElement.classList.add("lenis-on");
        cleanup = () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
          lenisRef.current = null;
          document.documentElement.classList.remove("lenis-on");
        };
      }
    );

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [tier]);

  const scrollTo = useCallback<SmoothScrollValue["scrollTo"]>((target, opts) => {
    const lenis = lenisRef.current;
    const el = typeof target === "string" ? document.getElementById(target) : null;
    if (typeof target === "string" && !el) return;
    if (lenis) {
      lenis.scrollTo(el ?? (target as number), {
        offset: el ? -72 : 0,
        immediate: opts?.immediate,
        duration: 1.4,
      });
      return;
    }
    if (el) el.scrollIntoView({ behavior: opts?.immediate ? "auto" : "smooth" });
    else window.scrollTo({ top: target as number, behavior: opts?.immediate ? "auto" : "smooth" });
  }, []);

  const getLenis = useCallback(() => lenisRef.current, []);

  return (
    <SmoothScrollContext.Provider value={{ scrollTo, getLenis }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}
