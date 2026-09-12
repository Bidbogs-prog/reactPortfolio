import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";

/**
 * One place that registers every GSAP plugin we use. Import `gsap` from
 * here (not from "gsap") so plugins are always registered first. Safe to
 * import during SSG: registration is skipped without a window.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, Flip);
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, Flip };
