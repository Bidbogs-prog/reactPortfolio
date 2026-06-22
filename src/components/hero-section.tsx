import { Button } from "@/components/ui/button";
import { socials } from "@/data/socials";
import { ArrowUpRight, ArrowDown } from "lucide-react";

const ROLES = ["Full-Stack Development", "AI Integration", "Product Engineering"];

export default function HeroSection() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-glow" />
      <div className="pointer-events-none absolute -right-32 top-1/4 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[120px]" />

      <div className="container relative z-10 pt-28">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <p
            className="eyebrow mb-6 flex items-center gap-3 opacity-0"
            style={{ animation: "fadeUp 0.7s 0.05s cubic-bezier(.22,1,.36,1) forwards" }}
          >
            <span className="inline-block h-px w-8 bg-primary/60" />
            Full-Stack &amp; AI Engineer, Morocco
          </p>

          {/* Headline */}
          <h1
            className="display text-balance text-5xl leading-[0.95] text-foreground sm:text-6xl md:text-7xl lg:text-8xl opacity-0"
            style={{ animation: "fadeUp 0.8s 0.15s cubic-bezier(.22,1,.36,1) forwards" }}
          >
            I build <span className="text-primary">thoughtful</span>
            <br />
            software for the web.
          </h1>

          {/* Intro */}
          <p
            className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg opacity-0"
            style={{ animation: "fadeUp 0.8s 0.3s cubic-bezier(.22,1,.36,1) forwards" }}
          >
            I&apos;m Haytham Chhilif, a self-taught developer who turns ideas
            into fast, polished products. These days I&apos;m focused on weaving{" "}
            <span className="text-foreground">AI</span> into full-stack
            applications that feel genuinely useful.
            <span className="ml-1 inline-block h-5 w-[3px] translate-y-1 bg-primary animate-blink" />
          </p>

          {/* CTAs */}
          <div
            className="mt-10 flex flex-wrap items-center gap-4 opacity-0"
            style={{ animation: "fadeUp 0.8s 0.45s cubic-bezier(.22,1,.36,1) forwards" }}
          >
            <Button
              size="lg"
              className="group h-12 px-6 text-sm font-semibold"
              onClick={() => scrollTo("contact")}
            >
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-6 text-sm"
              onClick={() => scrollTo("work")}
            >
              View selected work
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

          {/* Rotating focus strip */}
          <div
            className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/60 pt-6 opacity-0"
            style={{ animation: "fadeUp 0.8s 0.6s cubic-bezier(.22,1,.36,1) forwards" }}
          >
            {ROLES.map((role) => (
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

      {/* Scroll hint */}
      <button
        onClick={() => scrollTo("about")}
        aria-label="Scroll to about"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary md:flex"
      >
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em]">
          Scroll
        </span>
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
