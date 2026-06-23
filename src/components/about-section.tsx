import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { skillGroups } from "@/data/skills";
import { interestGroups } from "@/data/interests";
import { useRegister } from "@/lib/register";

const ENGINEER_FACTS = [
  { value: "5+", label: "Years writing code" },
  { value: "10+", label: "Projects shipped" },
  { value: "∞", label: "Things left to learn" },
];

const POET_FACTS = [
  { value: "3", label: "Books edited" },
  { value: "MA", label: "Gender Studies" },
  { value: "∞", label: "Stories" },
];

export default function AboutSection() {
  const { register } = useRegister();
  const isPoet = register === "poet";

  const facts = isPoet ? POET_FACTS : ENGINEER_FACTS;

  return (
    <section id="about" className="relative border-t border-border/60 py-24 md:py-32">
      <div className="container">
        <SectionHeading
          num="01"
          eyebrow="About"
          title={isPoet ? "The person behind the words" : "The person behind the code"}
        />

        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Bio */}
          <div className="space-y-5 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {isPoet ? <PoetBio /> : <EngineerBio />}

            {/* Facts */}
            <Reveal delay={240}>
              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border/60 pt-8">
                {facts.map((fact) => (
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

          {/* Skills / interests */}
          <div className="space-y-8">
            {isPoet
              ? interestGroups.map((group, i) => (
                  <Reveal key={group.label} delay={i * 80}>
                    <div>
                      <GroupLabel>{group.label}</GroupLabel>
                      {group.subgroups ? (
                        <div className="space-y-4">
                          {group.subgroups.map((sub) => (
                            <div key={sub.label}>
                              <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground/60">
                                {sub.label}
                              </p>
                              <Chips items={sub.items} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Chips items={group.items ?? []} />
                      )}
                    </div>
                  </Reveal>
                ))
              : skillGroups.map((group, i) => (
                  <Reveal key={group.label} delay={i * 80}>
                    <div>
                      <GroupLabel>{group.label}</GroupLabel>
                      <Chips items={group.items} />
                    </div>
                  </Reveal>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
      <span className="text-primary">&#47;&#47;</span>
      {children}
    </h3>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground/90 transition-colors hover:border-primary/50 hover:text-primary"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function EngineerBio() {
  return (
    <>
      <Reveal>
        <p>
          I&apos;m a <span className="text-foreground">self-taught developer</span>{" "}
          from Morocco who fell for the web because of a simple idea: you can
          imagine something on Monday and have real people using it by Friday.
          That loop still drives everything I build.
        </p>
      </Reveal>
      <Reveal delay={80}>
        <p>
          I work across the whole stack, from designing clean, responsive
          interfaces to standing up the APIs and databases behind them. Lately
          I&apos;ve been leaning hard into{" "}
          <span className="text-foreground">AI engineering</span>: wiring
          language models into products, building RAG pipelines, and figuring out
          where a little intelligence makes an app feel effortless instead of
          gimmicky.
        </p>
      </Reveal>
      <Reveal delay={160}>
        <p>
          When I&apos;m not shipping, I&apos;m usually reverse-engineering
          something I admire or writing, sometimes code, sometimes poetry.
        </p>
      </Reveal>
    </>
  );
}

function PoetBio() {
  return (
    <>
      <Reveal>
        <p>
          I&apos;m Haytham, a <span className="text-foreground">Moroccan</span>{" "}
          with an outsized appetite for stories. I read whatever moves me —{" "}
          <span className="text-foreground">Camus, Murakami, Tolstoy</span> —
          watch more anime than I&apos;ll admit, lose weekends to soulslikes, and
          spend the rest of my time under a barbell.
        </p>
      </Reveal>
      <Reveal delay={80}>
        <p>
          I hold an{" "}
          <span className="text-foreground">MA in Gender Studies</span> from
          Mohamed Ben Abdellah University (2019). I edit for{" "}
          <span className="text-foreground">The Olive Writers</span>, a cultural
          NGO that runs creative-writing, poetry, and dance events for young
          people — anything that gives youth a way to express themselves. I
          edited the English editions of three published short-story anthologies.
        </p>
      </Reveal>
      <Reveal delay={160}>
        <p>
          Writing is where all of it lands. Whatever I&apos;m reading, playing,
          or training toward eventually finds its way into a line of verse — the
          quieter, more honest half of me. You can read some of it in my{" "}
          <Link
            to="/writings"
            className="text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
          >
            writings
          </Link>
          .
        </p>
      </Reveal>
    </>
  );
}
