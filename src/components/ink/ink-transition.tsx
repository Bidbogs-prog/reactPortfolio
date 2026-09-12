import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useRegister } from "@/lib/register";
import { useMotionTier } from "@/lib/motion/tier";

export interface FloodOptions {
  /** CSS color of the ink that floods the screen. */
  color: string;
  /** Where the drop lands, in viewport px. Defaults to the centre. */
  origin?: { x: number; y: number };
  /** Runs once the screen is fully covered; swap content here. */
  onCovered: () => void | Promise<void>;
  /** "drain": ink slides off the bottom. "absorb": it soaks back into the origin. */
  exit?: "drain" | "absorb";
}

interface InkTransitionValue {
  flood: (opts: FloodOptions) => Promise<void>;
  isFlooding: () => boolean;
}

const Ctx = createContext<InkTransitionValue>({
  flood: async ({ onCovered }) => {
    await onCovered();
  },
  isFlooding: () => false,
});

const nextPaint = () =>
  new Promise<void>((r) =>
    requestAnimationFrame(() => requestAnimationFrame(() => r()))
  );

/**
 * A full-screen ink flood used for route changes and register switches.
 * A drop of the destination colour grows from the origin until the screen
 * is covered, the caller swaps what's underneath, and the ink exits.
 * Full tier: turbulence-displaced edge and GSAP. Lite: plain circle with
 * the Web Animations API. Off: instant swap, no overlay.
 */
export function InkTransitionProvider({ children }: { children: ReactNode }) {
  const tier = useMotionTier();
  const { register } = useRegister();
  const svgRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const running = useRef(false);
  const tierRef = useRef(tier);
  const registerRef = useRef(register);
  useEffect(() => {
    tierRef.current = tier;
    registerRef.current = register;
  }, [tier, register]);

  const flood = useCallback(async (opts: FloodOptions) => {
    const svg = svgRef.current;
    const circle = circleRef.current;
    const currentTier = tierRef.current;
    if (running.current) return;
    if (currentTier === "off" || !svg || !circle) {
      await opts.onCovered();
      return;
    }
    running.current = true;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const ox = opts.origin?.x ?? w / 2;
    const oy = opts.origin?.y ?? h / 2;
    const far = Math.max(
      Math.hypot(ox, oy),
      Math.hypot(w - ox, oy),
      Math.hypot(ox, h - oy),
      Math.hypot(w - ox, h - oy)
    );
    const rMax = far * 1.35;
    const poet = registerRef.current === "poet";
    const exit = opts.exit ?? (poet ? "drain" : "absorb");

    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.style.visibility = "visible";
    circle.setAttribute("fill", opts.color);
    circle.setAttribute("cx", String(ox));
    circle.setAttribute("cy", String(oy));
    circle.setAttribute("r", "0");
    circle.style.opacity = "1";

    if (currentTier === "full") {
      const { gsap } = await import("@/lib/motion/gsap");
      svg.style.filter = poet ? "url(#ink-flood-poet)" : "url(#ink-flood-engineer)";
      await gsap.to(circle, {
        attr: { r: rMax },
        duration: poet ? 1.1 : 0.7,
        ease: poet ? "power2.in" : "expo.in",
      });
      await opts.onCovered();
      await nextPaint();
      // Hold a beat so the swap underneath settles (fonts, theme vars).
      await gsap.to({}, { duration: poet ? 0.25 : 0.12 });
      if (exit === "absorb") {
        await gsap.to(circle, {
          attr: { r: 0 },
          duration: 0.8,
          ease: "expo.inOut",
        });
      } else {
        await gsap.to(circle, {
          attr: { cy: h + rMax * 1.1 },
          duration: 1.3,
          ease: "power3.inOut",
        });
      }
      svg.style.filter = "";
    } else {
      const grow = circle.animate(
        [{ r: "0" }, { r: `${rMax}px` }] as Keyframe[],
        { duration: poet ? 800 : 520, easing: "cubic-bezier(.7,0,.9,.3)", fill: "forwards" }
      );
      await grow.finished;
      await opts.onCovered();
      await nextPaint();
      const shrink = circle.animate(
        exit === "absorb"
          ? ([{ r: `${rMax}px` }, { r: "0" }] as Keyframe[])
          : ([{ cy: `${oy}px` }, { cy: `${h + rMax * 1.1}px` }] as Keyframe[]),
        { duration: poet ? 900 : 600, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" }
      );
      await shrink.finished;
      grow.cancel();
      shrink.cancel();
    }

    circle.setAttribute("r", "0");
    svg.style.visibility = "hidden";
    running.current = false;
  }, []);

  const value = useMemo<InkTransitionValue>(
    () => ({ flood, isFlooding: () => running.current }),
    [flood]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] h-full w-full"
        style={{ visibility: "hidden" }}
        preserveAspectRatio="none"
      >
        <circle ref={circleRef} r="0" />
      </svg>
    </Ctx.Provider>
  );
}

export function useInkTransition() {
  return useContext(Ctx);
}
