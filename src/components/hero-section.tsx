import { Button } from "@/components/ui/button";
import { socials } from "@/data/socials";
import { useRegister } from "@/lib/register";
import { useAgent } from "@/lib/agent/agent-provider";
import { useSmoothScroll } from "@/lib/motion/smooth-scroll";
import { InkFluid } from "@/components/ink/ink-fluid";
import { InkHeadline } from "@/components/ink/ink-headline";
import { InkLines } from "@/components/ink/ink-lines";
import { InkLink } from "@/components/ink/ink-link";
import { InkStamp, InkStampGroup } from "@/components/ink/ink-stamp";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const COPY = {
  engineer: {
    eyebrow: "Full-Stack & AI Engineer, Morocco",
    headline: "I build software,\n*thoughtfully.*",
    intro:
      "I'm Haytham Chhilif, a self-taught developer who turns ideas into fast, polished products. Lately I'm weaving AI into full-stack apps that feel genuinely useful.",
    ask: "ask me anything…",
    focus: ["Full-Stack", "AI Integration", "Product"],
    hint: "move to stir the ink · click to drop some",
  },
  poet: {
    eyebrow: "Engineer who writes · builder of quiet things",
    headline: "I keep a little\n*corner* of the web.",
    intro:
      "I'm Haytham Chhilif. By day I build software; by night I write. This is where the two meet: the things I've made, and the words I've kept.",
    ask: "ask, and I'll answer…",
    focus: ["Code", "Verse", "Craft"],
    hint: "the ink follows you · tap to let a drop fall",
  },
} as const;

export default function HeroSection() {
  const { register } = useRegister();
  const { openPalette } = useAgent();
  const { scrollTo } = useSmoothScroll();
  const copy = COPY[register];
  const poet = register === "poet";

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Ink */}
      <InkFluid className="absolute inset-0 h-full w-full" />

      {/* Plotter grid (engineer) / paper vignette (poet) */}
      {poet ? (
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(90%_70%_at_70%_40%,transparent,hsl(var(--background))_100%)]" />
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(80%_70%_at_40%_40%,black,transparent)]" />
      )}

      {/* Right-margin marginalia */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex"
      >
        <span className="running-label !static !transform-none !rotate-180 !top-auto !left-auto">
          portfolio / 2026
        </span>
        <span className="marginalia max-w-[11rem] text-right">{copy.hint}</span>
      </div>

      <div className="container relative z-10 pb-28 pt-28 md:pb-36 md:pt-32">
        <div className="max-w-6xl">
          <p
            className="eyebrow mb-8 flex items-center gap-3"
            style={{ animation: "riseUp 0.7s 0.05s cubic-bezier(.22,1,.36,1) forwards" }}
          >
            <span className="inline-block h-px w-8 bg-primary/60" />
            {copy.eyebrow}
          </p>

          <InkHeadline
            text={copy.headline}
            trigger="mount"
            delay={0.15}
            stagger={0.032}
            className={cn(
              "display ink-text text-balance text-foreground",
              "text-[clamp(3.4rem,11vw,10.5rem)] leading-[0.9] tracking-[-0.035em]",
              poet && "font-medium italic tracking-[-0.02em]"
            )}
            lineClassName={(i) => (i === 1 ? "md:pl-[12vw]" : undefined)}
          />

          <div className="mt-12 grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7 md:col-start-2">
              <InkLines
                trigger="mount"
                delay={0.55}
                className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                {copy.intro}
              </InkLines>

              {/* The inkwell: the agent's front door */}
              <button
                type="button"
                onClick={openPalette}
                data-cursor="hover"
                className="inkwell group mt-8 flex w-full max-w-md items-center gap-3 rounded-full px-5 py-3.5 text-left transition-colors"
                style={{ animation: "riseUp 0.8s 0.5s cubic-bezier(.22,1,.36,1) forwards" }}
              >
                <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-primary/15" />
                  <Sparkles className="relative h-3.5 w-3.5 text-primary" />
                </span>
                <span className="flex-1 font-mono text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                  {copy.ask}
                </span>
                <InkStamp shape="rubber" className="!py-1 !px-1.5 text-[0.6rem]">
                  ⌘K
                </InkStamp>
              </button>

              <div
                className="mt-8 flex flex-wrap items-center gap-4"
                style={{ animation: "riseUp 0.8s 0.6s cubic-bezier(.22,1,.36,1) forwards" }}
              >
                <Button
                  size="lg"
                  className="group h-12 rounded-full px-6 text-sm font-semibold"
                  onClick={() => scrollTo("contact")}
                >
                  Start a project
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="ink-fill-btn h-12 rounded-full border-foreground/25 px-6 text-sm"
                >
                  <InkLink to="/writings">Read my writings</InkLink>
                </Button>

                <div className="ml-1 flex items-center gap-1">
                  {socials.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-3 md:col-start-10">
              <InkStampGroup className="flex flex-wrap gap-2 md:flex-col md:items-end" stagger={0.12}>
                {copy.focus.map((role, i) => (
                  <InkStamp key={role} as="li" index={i} className="list-none">
                    {role}
                  </InkStamp>
                ))}
              </InkStampGroup>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue: an ink drip that keeps falling */}
      <button
        type="button"
        onClick={() => scrollTo("about")}
        aria-label="Scroll to about"
        className="group absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary md:flex"
      >
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em]">Scroll</span>
        <span className="relative block h-12 w-px overflow-hidden bg-foreground/15">
          <span className="ink-drip absolute left-0 top-0 h-full w-full bg-primary" />
        </span>
      </button>

      <style>{`
        @keyframes riseUp {
          from { transform: translateY(18px); }
          to { transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
