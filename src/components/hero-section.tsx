import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { socials } from "@/data/socials";
import { useRegister } from "@/lib/register";
import { useAgent } from "@/lib/agent/agent-provider";
import { ScrambleHeadline } from "@/components/scramble-headline";
import { AmbientField } from "@/components/ambient-field";
import { ArrowUpRight, ArrowDown, Sparkles } from "lucide-react";

const COPY = {
  engineer: {
    eyebrow: "Full-Stack & AI Engineer, Morocco",
    headline: "I build software, thoughtfully.",
    intro:
      "I'm Haytham Chhilif, a self-taught developer who turns ideas into fast, polished products. Lately I'm weaving AI into full-stack apps that feel genuinely useful.",
    focus: ["Full-Stack Development", "AI Integration", "Product Engineering"],
  },
  poet: {
    eyebrow: "Engineer who writes · builder of quiet things",
    headline: "I keep a little corner of the web.",
    intro:
      "I'm Haytham Chhilif. By day I build software; by night I write. This is where the two meet — the things I've made, and the words I've kept.",
    focus: ["Code", "Verse", "Craft"],
  },
} as const;

export default function HeroSection() {
  const { register } = useRegister();
  const { openPalette } = useAgent();
  const copy = COPY[register];

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <AmbientField className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-glow" />
      <div className="pointer-events-none absolute -right-32 top-1/4 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[120px]" />

      <div className="container relative z-10 pt-28 pb-32 md:pb-36">
        <div className="max-w-4xl">
          <p
            className="eyebrow mb-6 flex items-center gap-3 opacity-0"
            style={{ animation: "fadeUp 0.7s 0.05s cubic-bezier(.22,1,.36,1) forwards" }}
          >
            <span className="inline-block h-px w-8 bg-primary/60" />
            {copy.eyebrow}
          </p>

          <h1
            className="display text-balance text-5xl leading-[0.95] text-foreground sm:text-6xl md:text-7xl lg:text-8xl opacity-0"
            style={{ animation: "fadeUp 0.8s 0.15s cubic-bezier(.22,1,.36,1) forwards" }}
            aria-label={copy.headline}
          >
            <ScrambleHeadline text={copy.headline} />
          </h1>

          <p
            key={register}
            className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg opacity-0"
            style={{ animation: "fadeUp 0.8s 0.3s cubic-bezier(.22,1,.36,1) forwards" }}
          >
            {copy.intro}
          </p>

          {/* Command bar — the agent's front door */}
          <button
            onClick={openPalette}
            className="group mt-9 flex w-full max-w-md items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3.5 text-left backdrop-blur-sm transition-colors hover:border-primary/50 opacity-0"
            style={{ animation: "fadeUp 0.8s 0.4s cubic-bezier(.22,1,.36,1) forwards" }}
          >
            <Sparkles className="h-4 w-4 shrink-0 text-primary" />
            <span className="flex-1 font-mono text-sm text-muted-foreground">
              {register === "poet" ? "ask, and I'll answer…" : "ask me anything…"}
            </span>
            <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[0.6rem] text-muted-foreground">
              ⌘K
            </kbd>
          </button>

          <div
            className="mt-9 flex flex-wrap items-center gap-4 opacity-0"
            style={{ animation: "fadeUp 0.8s 0.5s cubic-bezier(.22,1,.36,1) forwards" }}
          >
            <Button
              size="lg"
              className="group h-12 px-6 text-sm font-semibold"
              onClick={() => scrollTo("contact")}
            >
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 text-sm">
              <Link to="/writings">Read my writings</Link>
            </Button>

            <div className="ml-1 flex items-center gap-1">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <div
            className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/60 pt-9 opacity-0"
            style={{ animation: "fadeUp 0.8s 0.6s cubic-bezier(.22,1,.36,1) forwards" }}
          >
            {copy.focus.map((role) => (
              <span
                key={role}
                className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => scrollTo("about")}
        aria-label="Scroll to about"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary md:flex"
      >
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em]">Scroll</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </button>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
