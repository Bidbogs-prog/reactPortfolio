import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { writings, formatDate, type WritingKind } from "@/lib/writings";
import { Reveal } from "@/components/reveal";
import { KindIcon } from "@/components/kind-icon";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

type Filter = "all" | WritingKind;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "verse", label: "Verse" },
  { value: "prose", label: "Prose" },
  { value: "code", label: "Code" },
];

export default function WritingsPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(
    () => (filter === "all" ? writings : writings.filter((w) => w.kind === filter)),
    [filter]
  );

  return (
    <section className="relative min-h-screen pt-32 pb-24">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(60%_40%_at_50%_0%,black,transparent)]" />
      <div className="container relative">
        <Reveal>
          <p className="eyebrow mb-4 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-primary/50" />
            Writings
          </p>
          <h1 className="display text-balance text-4xl text-foreground sm:text-5xl md:text-6xl">
            Code &amp; verse
          </h1>
          <p className="mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Two streams from the same desk: things I&apos;ve learned building
            software, and the occasional poem that escapes the terminal.
          </p>
        </Reveal>

        {/* Filter */}
        <Reveal delay={80}>
          <div className="mt-10 flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors",
                  filter === f.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* List */}
        <div className="mt-12 flex flex-col">
          {visible.map((w, i) => (
            <Reveal key={w.slug} delay={i * 60}>
              <Link
                to={`/writings/${w.slug}`}
                className="group grid gap-3 border-t border-border/60 py-8 md:grid-cols-[auto_1fr_auto] md:items-baseline md:gap-8"
              >
                <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <KindIcon kind={w.kind} className="h-3.5 w-3.5 text-primary" />
                  {w.kind}
                </span>

                <div className="max-w-2xl">
                  <h2 className="font-display text-xl font-semibold text-foreground transition-colors group-hover:text-primary md:text-2xl">
                    {w.title}
                  </h2>
                  <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                    {w.summary}
                  </p>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                  {formatDate(w.date)}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            </Reveal>
          ))}

          {visible.length === 0 && (
            <p className="border-t border-border/60 py-12 font-mono text-sm text-muted-foreground">
              Nothing here yet under &ldquo;{filter}&rdquo;.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
