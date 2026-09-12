import type { ReactNode } from "react";
import { SectionFrame } from "@/components/section-frame";
import { InkLines } from "@/components/ink/ink-lines";
import { InkLink } from "@/components/ink/ink-link";
import { InkStamp, InkStampGroup } from "@/components/ink/ink-stamp";
import { InkCounter } from "@/components/ink/ink-counter";
import { Plotter } from "@/components/ink/plotter";
import { useInkReveal } from "@/lib/motion/use-ink-reveal";
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
  const factsRef = useInkReveal<HTMLDListElement>({ stagger: 0.1 });

  return (
    <SectionFrame
      id="about"
      num="01"
      eyebrow="About"
      title={isPoet ? "The person behind the words" : "The person behind the code"}
      note={
        isPoet
          ? "the quill draws as you scroll: the line is yours"
          : "plotter draws one trace per visit: no two identical"
      }
    >
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-10">
        {/* Bio */}
        <div className="space-y-6 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg lg:col-span-6">
          {isPoet ? <PoetBio /> : <EngineerBio />}
        </div>

        {/* Illustration bleeds out of the right edge */}
        <div className="relative lg:col-span-6 lg:-mr-[8vw] lg:pl-4">
          <Plotter className="lg:scale-[1.04] lg:origin-left" />
          <span className="marginalia mt-3 block lg:pl-6">
            {isPoet ? "fig. 01 — a line, drawn by hand" : "fig. 01 — pen plotter, one trace"}
          </span>
        </div>

        {/* Facts */}
        <dl
          ref={factsRef}
          className="grid grid-cols-3 gap-6 lg:col-span-6 lg:mt-4"
        >
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-display text-4xl text-primary md:text-5xl">
                <InkCounter value={fact.value} />
              </dt>
              <dd className="marginalia mt-2">{fact.label}</dd>
            </div>
          ))}
        </dl>

        {/* Skills / interests as stamps */}
        <div className="space-y-9 lg:col-span-6 lg:mt-4 lg:pl-4">
          {isPoet
            ? interestGroups.map((group, gi) => (
                <div key={group.label}>
                  <GroupLabel>{group.label}</GroupLabel>
                  {group.subgroups ? (
                    <div className="space-y-4">
                      {group.subgroups.map((sub, si) => (
                        <div key={sub.label}>
                          <p className="mb-2 font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground/60">
                            {sub.label}
                          </p>
                          <Stamps items={sub.items} offset={gi * 10 + si * 3} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Stamps items={group.items ?? []} offset={gi * 10} />
                  )}
                </div>
              ))
            : skillGroups.map((group, gi) => (
                <div key={group.label}>
                  <GroupLabel>{group.label}</GroupLabel>
                  <Stamps items={group.items} offset={gi * 7} />
                </div>
              ))}
        </div>
      </div>
    </SectionFrame>
  );
}

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
      <span className="text-primary">&#47;&#47;</span>
      {children}
    </h3>
  );
}

function Stamps({ items, offset = 0 }: { items: string[]; offset?: number }) {
  return (
    <InkStampGroup className="flex flex-wrap gap-2.5">
      {items.map((item, i) => (
        <InkStamp key={item} as="li" index={offset + i} className="list-none" data-hover>
          {item}
        </InkStamp>
      ))}
    </InkStampGroup>
  );
}

function EngineerBio() {
  return (
    <>
      <InkLines>
        I&apos;m a <span className="text-foreground">self-taught developer</span> from
        Morocco who fell for the web because of a simple idea: you can imagine
        something on Monday and have real people using it by Friday. That loop
        still drives everything I build.
      </InkLines>
      <InkLines delay={0.1}>
        I work across the whole stack, from designing clean, responsive
        interfaces to standing up the APIs and databases behind them. Lately
        I&apos;ve been leaning hard into{" "}
        <span className="text-foreground">AI engineering</span>: wiring language
        models into products, building RAG pipelines, and figuring out where a
        little intelligence makes an app feel effortless instead of gimmicky.
      </InkLines>
      <InkLines delay={0.2}>
        When I&apos;m not shipping, I&apos;m usually reverse-engineering
        something I admire or writing, sometimes code, sometimes poetry.
      </InkLines>
    </>
  );
}

function PoetBio() {
  return (
    <>
      <InkLines>
        I&apos;m Haytham, a <span className="text-foreground">Moroccan</span> with
        an outsized appetite for stories. I read whatever moves me,{" "}
        <span className="text-foreground">Camus, Murakami, Tolstoy</span>, watch
        more anime than I&apos;ll admit, lose weekends to soulslikes, and spend
        the rest of my time under a barbell.
      </InkLines>
      <InkLines delay={0.1}>
        I hold an <span className="text-foreground">MA in Gender Studies</span>{" "}
        from Mohamed Ben Abdellah University (2019). I edit for{" "}
        <span className="text-foreground">The Olive Writers</span>, a cultural
        NGO that runs creative-writing, poetry, and dance events for young
        people, anything that gives youth a way to express themselves. I edited
        the English editions of three published short-story anthologies.
      </InkLines>
      <InkLines delay={0.2}>
        Writing is where all of it lands. Whatever I&apos;m reading, playing, or
        training toward eventually finds its way into a line of verse, the
        quieter, more honest half of me. You can read some of it in my{" "}
        <InkLink
          to="/writings"
          className="text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
        >
          writings
        </InkLink>
        .
      </InkLines>
    </>
  );
}
