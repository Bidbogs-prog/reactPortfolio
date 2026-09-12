import { useEffect, useRef } from "react";
import { useRegister } from "@/lib/register";
import { useMotionTier } from "@/lib/motion/tier";
import { cn } from "@/lib/utils";

/** The circuit the plotter draws. Orthogonal, like a PCB trace. */
const TRACE =
  "M70 318 H150 V246 H214 V318 H286 V202 H350 V282 H418 V166 H470 V246 H530";
/** Pads and vias along the trace. */
const NODES: [number, number][] = [
  [70, 318],
  [150, 246],
  [214, 318],
  [286, 202],
  [350, 282],
  [418, 166],
  [470, 246],
  [530, 246],
];

/** The line the quill draws. */
const WAVE =
  "M52 292 C 110 190, 176 402, 244 292 S 340 176, 402 292 S 500 380, 556 262";
const SPLATTERS: [number, number, number][] = [
  [128, 236, 3.5],
  [206, 344, 2.4],
  [318, 214, 2.8],
  [372, 340, 4],
  [458, 232, 2.2],
  [522, 316, 3],
];

/**
 * The About illustration. Engineer: a pen plotter drawing a circuit trace
 * (the pen head rides the rail and follows the line). Poet: a quill
 * drawing a wave, with ink splatters where it turns. Full tier animates
 * with DrawSVG + MotionPath; lite draws the stroke with CSS; off shows
 * the finished drawing.
 */
export function Plotter({ className }: { className?: string }) {
  const { register } = useRegister();
  const tier = useMotionTier();
  const ref = useRef<SVGSVGElement>(null);
  const poet = register === "poet";

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    if (tier === "off") {
      svg.classList.add("is-drawn", "is-static");
      return;
    }
    if (tier !== "full") {
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            svg.classList.add("is-drawn");
            io.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      io.observe(svg);
      return () => io.disconnect();
    }

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    import("@/lib/motion/gsap").then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        svg.classList.add("is-gsap");
        const line = svg.querySelector<SVGPathElement>(".draw-line");
        const head = svg.querySelector<SVGGElement>(".draw-head");
        const arm = svg.querySelector<SVGLineElement>(".draw-arm");
        const carriage = svg.querySelector<SVGRectElement>(".draw-carriage");
        const nodes = svg.querySelectorAll<SVGElement>(".draw-node");
        const frame = svg.querySelectorAll<SVGElement>(".draw-frame");
        if (!line || !head) return;

        // Park the head at the start of the line before anything draws.
        gsap.set(head, {
          motionPath: { path: line, align: line, alignOrigin: [0.5, 0.5], start: 0, end: 0.0001 },
        });
        if (arm && carriage) {
          const sx = Number(gsap.getProperty(head, "x"));
          const sy = Number(gsap.getProperty(head, "y"));
          arm.setAttribute("x1", String(sx));
          arm.setAttribute("x2", String(sx));
          arm.setAttribute("y2", String(sy - 8));
          carriage.setAttribute("x", String(sx - 14));
        }

        const tl = gsap.timeline({
          scrollTrigger: poet
            ? { trigger: svg, start: "top 80%", end: "bottom 45%", scrub: 1.4 }
            : { trigger: svg, start: "top 75%", once: true },
          defaults: { ease: "none" },
        });

        if (frame.length) {
          tl.from(frame, { drawSVG: "0%", duration: poet ? 0.6 : 1.1, ease: "power2.inOut", stagger: 0.08 }, 0);
        }
        const drawDur = poet ? 3 : 4.2;
        tl.fromTo(line, { drawSVG: "0%" }, { drawSVG: "100%", duration: drawDur }, poet ? 0.3 : 0.9);
        tl.to(
          head,
          {
            motionPath: { path: line, align: line, alignOrigin: [0.5, 0.5], autoRotate: poet },
            duration: drawDur,
            onUpdate: () => {
              if (!arm || !carriage) return;
              const x = Number(gsap.getProperty(head, "x"));
              const y = Number(gsap.getProperty(head, "y"));
              arm.setAttribute("x1", String(x));
              arm.setAttribute("x2", String(x));
              arm.setAttribute("y2", String(y - 8));
              carriage.setAttribute("x", String(x - 14));
            },
          },
          "<"
        );
        // Pads / splatters pop in as the line reaches them.
        nodes.forEach((n, i) => {
          tl.fromTo(
            n,
            { scale: 0, transformOrigin: "50% 50%" },
            { scale: 1, duration: 0.3, ease: "back.out(3)" },
            (poet ? 0.3 : 0.9) + (drawDur * (i + 0.5)) / nodes.length
          );
        });
      }, svg);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [tier, poet]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 420"
      aria-hidden="true"
      className={cn("plotter block h-auto w-full overflow-visible text-foreground", className)}
      fill="none"
      strokeLinecap={poet ? "round" : "square"}
      strokeLinejoin={poet ? "round" : "miter"}
    >
      {poet ? (
        <>
          {/* the wave */}
          <path
            className="draw-line"
            d={WAVE}
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            style={{ filter: "url(#ink-bleed)" }}
          />
          <path
            className="draw-frame"
            d="M52 300 C 110 200, 176 410, 244 300 S 340 186, 402 300 S 500 388, 556 270"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.3"
          />
          {SPLATTERS.map(([x, y, r], i) => (
            <circle
              key={i}
              className="draw-node"
              style={{ ["--k" as string]: i }}
              cx={x}
              cy={y}
              r={r}
              fill="hsl(var(--primary))"
              opacity="0.75"
            />
          ))}
          {/* the quill, drawn at the origin and moved along the wave */}
          <g className="draw-head" transform="translate(556,262)">
            <g transform="rotate(-40)">
              <path d="M0 0 L 6 -70" stroke="currentColor" strokeWidth="2" />
              <path
                d="M6 -70 C -20 -60, -22 -30, -2 -18 C 2 -34, 8 -50, 6 -70 Z"
                fill="currentColor"
                opacity="0.9"
              />
              <path
                d="M6 -70 C 26 -58, 24 -30, 8 -20 C 6 -36, 4 -52, 6 -70 Z"
                fill="currentColor"
                opacity="0.55"
              />
              <path d="M-14 -40 L -2 -30 M-16 -52 L -4 -44 M20 -44 L 8 -34" stroke="hsl(var(--background))" strokeWidth="0.8" />
            </g>
          </g>
        </>
      ) : (
        <>
          {/* the bed */}
          <rect className="draw-frame" x="40" y="60" width="520" height="320" rx="4" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
          <g stroke="currentColor" strokeWidth="1" opacity="0.28">
            {Array.from({ length: 13 }, (_, i) => (
              <path key={i} className="draw-frame" d={`M${40 + i * 40 + 20} 60 v6 M${40 + i * 40 + 20} 380 v-6`} />
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <path key={`h${i}`} className="draw-frame" d={`M40 ${60 + i * 40 + 20} h6 M560 ${60 + i * 40 + 20} h-6`} />
            ))}
          </g>
          {/* rail */}
          <line className="draw-frame" x1="40" y1="92" x2="560" y2="92" stroke="currentColor" strokeWidth="3" opacity="0.6" />
          <line className="draw-frame" x1="40" y1="100" x2="560" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.35" />
          {/* trace */}
          <path className="draw-line" d={TRACE} stroke="hsl(var(--primary))" strokeWidth="3" />
          {NODES.map(([x, y], i) => (
            <rect
              key={i}
              className="draw-node"
              style={{ ["--k" as string]: i }}
              x={x - 6}
              y={y - 6}
              width="12"
              height="12"
              fill="hsl(var(--background))"
              stroke="hsl(var(--primary))"
              strokeWidth="2.5"
            />
          ))}
          {/* arm + carriage + pen head */}
          <line className="draw-arm" x1="530" y1="100" x2="530" y2="238" stroke="currentColor" strokeWidth="2" opacity="0.7" />
          <rect className="draw-carriage" x="516" y="82" width="28" height="22" rx="2" fill="hsl(var(--background))" stroke="currentColor" strokeWidth="2" />
          <g className="draw-head" transform="translate(530,246)">
            <circle r="7" fill="hsl(var(--background))" stroke="currentColor" strokeWidth="2" />
            <circle r="2.5" fill="hsl(var(--primary))" />
          </g>
        </>
      )}
    </svg>
  );
}
