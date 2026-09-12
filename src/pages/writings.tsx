import { useMemo, useState } from "react";
import { writings, formatDate, type WritingKind } from "@/lib/writings";
import { InkHeadline } from "@/components/ink/ink-headline";
import { InkLines } from "@/components/ink/ink-lines";
import { InkLink } from "@/components/ink/ink-link";
import { InkStamp } from "@/components/ink/ink-stamp";
import { InkBlots } from "@/components/ink/ink-blots";
import { InkRule } from "@/components/ink/ink-rule";
import { useInkReveal } from "@/lib/motion/use-ink-reveal";
import { KindIcon } from "@/components/kind-icon";
import { useRegister } from "@/lib/register";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { Seo, SITE_URL, SITE_NAME } from "@/components/seo";

const WRITINGS_DESCRIPTION =
  "Two streams from the same desk: things I've learned building software, and the occasional poem that escapes the terminal.";

const blogLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: `Writings — ${SITE_NAME}`,
  description: WRITINGS_DESCRIPTION,
  url: `${SITE_URL}/writings`,
  author: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
  blogPost: writings.map((w) => ({
    "@type": "BlogPosting",
    headline: w.title,
    datePublished: w.date,
    url: `${SITE_URL}/writings/${w.slug}`,
  })),
};

type Filter = "all" | WritingKind;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "verse", label: "Verse" },
  { value: "prose", label: "Prose" },
  { value: "code", label: "Code" },
];

export default function WritingsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const { register } = useRegister();
  const poet = register === "poet";
  const listRef = useInkReveal<HTMLDivElement>({ stagger: 0.06, selector: ".writing-row" });

  const visible = useMemo(
    () => (filter === "all" ? writings : writings.filter((w) => w.kind === filter)),
    [filter]
  );

  return (
    <section className="section-frame relative min-h-screen overflow-hidden pb-24 pt-32">
      <Seo
        title={`Writings — ${SITE_NAME}`}
        description={WRITINGS_DESCRIPTION}
        path="/writings"
        jsonLd={blogLd}
      />

      {/* A faint ink field behind the header */}
      <InkBlots
        className="absolute inset-x-0 top-0 h-[60vh] opacity-40"
        intensity={0.5}
        interactive={false}
        every={4.5}
      />
      {!poet && (
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(60%_40%_at_50%_0%,black,transparent)]" />
      )}

      <div className="container relative">
        <span aria-hidden="true" className="running-label hidden xl:block">
          writings / index
        </span>
        <span aria-hidden="true" className="section-numeral !top-[0.2em]">
          ¶
        </span>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-primary/50" />
              Writings
            </p>
            <InkHeadline
              text={poet ? "*Verse* & code" : "Code & *verse*"}
              trigger="mount"
              delay={0.1}
              className={cn(
                "display ink-text text-balance text-[clamp(3rem,9vw,8rem)] leading-[0.92] tracking-[-0.035em] text-foreground",
                poet && "font-medium italic tracking-[-0.02em]"
              )}
            />
          </div>
          <div className="lg:col-span-4 lg:flex lg:items-end">
            <InkLines
              trigger="mount"
              delay={0.4}
              className="max-w-sm text-pretty leading-relaxed text-muted-foreground lg:text-right"
            >
              {WRITINGS_DESCRIPTION}
            </InkLines>
          </div>
        </div>

        {/* Filter stamps */}
        <div className="mt-12 flex flex-wrap gap-2.5" role="tablist" aria-label="Filter writings">
          {FILTERS.map((f, i) => (
            <InkStamp
              key={f.value}
              as="button"
              type="button"
              index={i}
              solid={filter === f.value}
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => setFilter(f.value)}
              data-hover
            >
              {f.label}
            </InkStamp>
          ))}
        </div>

        {/* List */}
        <div ref={listRef} className="mt-14 flex flex-col">
          {visible.map((w, i) => (
            <InkLink
              key={w.slug}
              to={`/writings/${w.slug}`}
              className="writing-row group relative grid gap-3 py-9 md:grid-cols-[7rem_1fr_auto] md:items-baseline md:gap-8"
            >
              <InkRule seed={i + 11} className="absolute left-0 top-0" />

              <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">
                <KindIcon kind={w.kind} className="h-3.5 w-3.5 text-primary" />
                {w.kind}
              </span>

              <div className="max-w-2xl">
                <h2
                  className={cn(
                    "display text-2xl text-foreground transition-colors group-hover:text-primary md:text-[2rem] md:leading-tight",
                    (w.kind === "verse" || poet) && "font-serif font-medium italic"
                  )}
                >
                  {w.title}
                </h2>
                <p className="mt-2 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                  {w.summary}
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                {formatDate(w.date)}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
            </InkLink>
          ))}

          {visible.length === 0 && (
            <p className="relative py-12 font-mono text-sm text-muted-foreground">
              <InkRule seed={2} className="absolute left-0 top-0" />
              Nothing here yet under &ldquo;{filter}&rdquo;.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
