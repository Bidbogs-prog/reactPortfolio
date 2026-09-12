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
import { useMotionTier, whenIdle } from "@/lib/motion/tier";
import { inkTheme, hslTripleToRgb } from "@/lib/motion/ink-theme";
import type { PlateScene } from "./three/plate-scene";

interface PlateValue {
  show: (src: string) => void;
  hide: () => void;
  /** True when hover previews are live (full tier + WebGL ready). */
  enabled: boolean;
}

const Ctx = createContext<PlateValue>({ show: () => {}, hide: () => {}, enabled: false });

const W = 460;
const H = 288; // 16:10, matches the 1200x750 captures

/**
 * Hosts the cursor-following screenshot plate for a list of projects.
 * Children call `useInkPlate().show(src)` on hover. Full tier only; on
 * lite/off `enabled` is false and rows render their image inline.
 */
export function InkPlateProvider({ images, children }: { images: string[]; children: ReactNode }) {
  const tier = useMotionTier();
  const { register } = useRegister();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<PlateScene | null>(null);
  const enabled = tier === "full";

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let raf = 0;
    let scene: PlateScene | null = null;
    const pos = { x: -1000, y: -1000 };
    const target = { x: -1000, y: -1000 };
    const vel = { x: 0, y: 0 };
    let last = performance.now();
    let active = false;

    const cancelIdle = whenIdle(() => {
      import("./three/plate-scene").then(({ PlateScene: Ctor }) => {
        if (cancelled) return;
        try {
          scene = new Ctor(canvas);
        } catch {
          return;
        }
        scene.resize(W, H);
        scene.preload(images);
        const theme = inkTheme(register);
        scene.setTheme(hslTripleToRgb(theme.accent), theme.fluid.gridSnap > 0 ? 1 : 0);
        sceneRef.current = scene;

        const loop = (now: number) => {
          const dt = Math.min(0.05, (now - last) / 1000);
          last = now;
          const poet = register === "poet";
          const k = poet ? 0.1 : 0.18;
          const nx = pos.x + (target.x - pos.x) * k;
          const ny = pos.y + (target.y - pos.y) * k;
          vel.x = nx - pos.x;
          vel.y = ny - pos.y;
          pos.x = nx;
          pos.y = ny;
          canvas.style.transform = `translate3d(${pos.x - W / 2}px, ${pos.y - H / 2}px, 0) rotate(${vel.x * 0.06}deg)`;
          scene?.setTilt(Math.max(-1, Math.min(1, vel.x / 40)), Math.max(-1, Math.min(1, vel.y / 40)));
          const drawing = scene?.tick(dt, poet ? 3.5 : 7) ?? false;
          active = drawing;
          canvas.style.opacity = drawing ? "1" : "0";
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      });
    });

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX + 40;
      target.y = e.clientY;
      if (!active && pos.x < -500) {
        pos.x = target.x;
        pos.y = target.y;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      cancelled = true;
      cancelIdle();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [enabled, images, register]);

  const show = useCallback((src: string) => sceneRef.current?.show(src), []);
  const hide = useCallback(() => sceneRef.current?.hide(), []);
  const value = useMemo(() => ({ show, hide, enabled }), [show, hide, enabled]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {enabled && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          width={W}
          height={H}
          className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block"
          style={{ width: W, height: H, opacity: 0, willChange: "transform" }}
        />
      )}
    </Ctx.Provider>
  );
}

export function useInkPlate() {
  return useContext(Ctx);
}
