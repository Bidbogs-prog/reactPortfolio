import { useEffect, useState } from "react";

/**
 * How much motion the device gets.
 *
 * - "full": WebGL scenes, smooth scroll, custom cursor, GSAP everything.
 *   Pointer-capable, >= 1024px, WebGL2, a few cores, no reduced-motion.
 * - "lite": the same ideas in 2D canvas / SVG / CSS keyframes. Phones,
 *   tablets, weak laptops. Also what the SSG renders so markup matches.
 * - "off": prefers-reduced-motion. Every ink effect renders finished.
 */
export type MotionTier = "full" | "lite" | "off";

let cached: MotionTier | null = null;
const listeners = new Set<(t: MotionTier) => void>();

function hasWebGL2(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!c.getContext("webgl2");
  } catch {
    return false;
  }
}

export function resolveMotionTier(): MotionTier {
  if (typeof window === "undefined") return "lite";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const wide = window.matchMedia("(min-width: 1024px)").matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  if (finePointer && wide && cores >= 4 && hasWebGL2()) return "full";
  return "lite";
}

export function getMotionTier(): MotionTier {
  if (cached) return cached;
  cached = resolveMotionTier();
  return cached;
}

/** Mirror the tier on <html> so CSS can gate expensive decoration. */
function reflect(tier: MotionTier) {
  if (typeof document !== "undefined") document.documentElement.dataset.motion = tier;
}

function recompute() {
  const next = resolveMotionTier();
  if (next !== cached) {
    cached = next;
    reflect(next);
    listeners.forEach((l) => l(next));
  }
}

let watching = false;
function watch() {
  if (watching || typeof window === "undefined") return;
  watching = true;
  for (const q of [
    "(prefers-reduced-motion: reduce)",
    "(pointer: fine)",
    "(min-width: 1024px)",
  ]) {
    window.matchMedia(q).addEventListener("change", recompute);
  }
}

/**
 * The current tier. Always "lite" on the first render (server and client
 * agree), then upgrades in an effect. Re-evaluates when the viewport or the
 * reduced-motion preference changes.
 */
export function useMotionTier(): MotionTier {
  const [tier, setTier] = useState<MotionTier>("lite");
  useEffect(() => {
    watch();
    const t = getMotionTier();
    reflect(t);
    setTier(t);
    listeners.add(setTier);
    return () => {
      listeners.delete(setTier);
    };
  }, []);
  return tier;
}

/** Run `cb` when the browser is idle (or soon, where idle callbacks are missing). */
export function whenIdle(cb: () => void, timeout = 1200): () => void {
  if (typeof window === "undefined") return () => {};
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  if (w.requestIdleCallback && w.cancelIdleCallback) {
    const id = w.requestIdleCallback(cb, { timeout });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(cb, 200);
  return () => window.clearTimeout(id);
}
