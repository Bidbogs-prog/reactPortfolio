import type { Register } from "@/lib/register";

/**
 * Everything that makes engineer ink and poet ink behave differently.
 * Engineer: ink on a pen-plotter grid. Hard edges, dither, snappy.
 * Poet: ink dropped in water. Soft blooms, slow diffusion, overshoot.
 */
export interface InkTheme {
  register: Register;
  /** Accent as an `h s% l%` triple, matches the CSS `--primary` token. */
  accent: string;
  /** Background as an `h s% l%` triple. */
  ink: string;
  ease: string;
  easeIn: string;
  /** Duration multiplier: poet lingers. */
  tempo: number;
  fluid: {
    viscosity: number;
    dissipation: number;
    velocityDissipation: number;
    splatRadius: number;
    /** 0 = free, 1 = fully snapped to the plotter grid. */
    gridSnap: number;
    dither: number;
    curl: number;
    /** Seconds between idle drops. */
    dropEvery: number;
  };
  blots: { blur: number; contrast: number; growth: number; count: number };
  cursor: "nib" | "brush";
  stamp: "rubber" | "seal";
  divider: { baseFrequency: number; scale: number; octaves: number; drips: boolean };
  headline: "pour" | "bloom";
  illustration: "plotter" | "quill";
}

const ENGINEER: InkTheme = {
  register: "engineer",
  accent: "74 92% 60%",
  ink: "240 10% 5%",
  ease: "expo.out",
  easeIn: "expo.in",
  tempo: 1,
  fluid: {
    viscosity: 0.2,
    dissipation: 0.994,
    velocityDissipation: 0.975,
    splatRadius: 0.0036,
    gridSnap: 0.3,
    dither: 0.8,
    curl: 8,
    dropEvery: 7,
  },
  blots: { blur: 14, contrast: 26, growth: 1.0, count: 7 },
  cursor: "nib",
  stamp: "rubber",
  divider: { baseFrequency: 0.09, scale: 6, octaves: 3, drips: false },
  headline: "pour",
  illustration: "plotter",
};

const POET: InkTheme = {
  register: "poet",
  accent: "24 86% 67%",
  ink: "26 16% 6%",
  ease: "power2.inOut",
  easeIn: "power2.in",
  tempo: 1.5,
  fluid: {
    viscosity: 0.9,
    dissipation: 0.998,
    velocityDissipation: 0.988,
    splatRadius: 0.0055,
    gridSnap: 0,
    dither: 0,
    curl: 18,
    dropEvery: 5,
  },
  blots: { blur: 22, contrast: 18, growth: 1.6, count: 5 },
  cursor: "brush",
  stamp: "seal",
  divider: { baseFrequency: 0.018, scale: 22, octaves: 2, drips: true },
  headline: "bloom",
  illustration: "quill",
};

export function inkTheme(register: Register): InkTheme {
  return register === "poet" ? POET : ENGINEER;
}

/** The CSS color string for a theme accent, with optional alpha. */
export function accentCss(theme: InkTheme, alpha = 1): string {
  return alpha === 1
    ? `hsl(${theme.accent})`
    : `hsl(${theme.accent} / ${alpha})`;
}

/** Parse an `h s% l%` triple into normalized RGB for shaders and canvas. */
export function hslTripleToRgb(triple: string): [number, number, number] {
  const [h, s, l] = triple
    .split(/\s+/)
    .map((v) => parseFloat(v));
  const sat = s / 100;
  const lig = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n: number) =>
    lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}
