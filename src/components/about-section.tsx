import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { skillGroups } from "@/data/skills";

const FACTS = [
  { value: "5+", label: "Years writing code" },
  { value: "10+", label: "Projects shipped" },
  { value: "∞", label: "Things left to learn" },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative border-t border-border/60 py-24 md:py-32">
      <div className="container">
        <SectionHeading num="01" eyebrow="About" title="The person behind the code" />

        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Bio */}
          <div className="space-y-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            <Reveal>
              <p>
                I&apos;m a <span className="text-foreground">self-taught developer</span>{" "}
                from Morocco who fell for the web because of a simple idea: you
                can imagine something on Monday and have real people using it by
                Friday. That loop still drives everything I build.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <p>
                I work across the whole stack, from designing clean, responsive
                interfaces to standing up the APIs and databases behind them.
                Lately I&apos;ve been leaning hard into{" "}
                <span className="text-foreground">AI engineering</span>: wiring
                language models into products, building RAG pipelines, and
                figuring out where a little intelligence makes an app feel
                effortless instead of gimmicky.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p>
                When I&apos;m not shipping, I&apos;m usually reverse-engineering
                something I admire or writing, sometimes code, sometimes poetry.
              </p>
            </Reveal>

            {/* Facts */}
            <Reveal delay={240}>
              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border/60 pt-8">
                {FACTS.map((fact) => (
                  <div key={fact.label}>
                    <dt className="font-display text-3xl text-primary md:text-4xl">
                      {fact.value}
                    </dt>
                    <dd className="mt-1 text-xs text-muted-foreground md:text-sm">
                      {fact.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Skills */}
          <div className="space-y-8">
            {skillGroups.map((group, i) => (
              <Reveal key={group.label} delay={i * 80}>
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <span className="text-primary">&#47;&#47;</span>
                    {group.label}
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground/90 transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
