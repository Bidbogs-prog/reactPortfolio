import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { faq } from "@/data/faq";

export default function FaqSection() {
  return (
    <section id="faq" className="relative border-t border-border/60 py-24 md:py-32">
      <div className="container">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />

        <dl className="flex flex-col">
          {faq.map((item, i) => (
            <Reveal key={item.q} delay={i * 50}>
              <div className="grid gap-3 border-t border-border/60 py-8 md:grid-cols-[auto_1fr] md:gap-10">
                <span className="font-mono text-sm text-muted-foreground/60">
                  0{i + 1}
                </span>
                <div className="max-w-2xl">
                  <dt className="font-display text-xl font-semibold text-foreground md:text-2xl">
                    {item.q}
                  </dt>
                  <dd className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                    {item.a}
                  </dd>
                </div>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
