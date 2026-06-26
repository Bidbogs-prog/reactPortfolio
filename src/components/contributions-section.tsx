import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { contributions } from "@/data/contributions";
import { useRegister } from "@/lib/register";
import { ArrowUpRight } from "lucide-react";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ContributionsSection() {
  const { register } = useRegister();

  // Professional web collaborations belong to the engineer side only.
  if (register === "poet") return null;

  return (
    <section
      id="contributions"
      className="relative border-t border-border/60 py-24 md:py-32"
    >
      <div className="container">
        <SectionHeading
          num="03"
          eyebrow="Collaborations"
          title="Sites I've contributed to"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contributions.map((c, i) => (
            <Reveal key={c.id} delay={i * 60}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${c.name}`}
                className="group flex h-full flex-col rounded-xl border border-border bg-card/50 p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                    {c.name}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>

                <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {c.description}
                </p>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {c.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-xs text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <span className="mt-4 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground/70">
                  {hostOf(c.url)}
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
