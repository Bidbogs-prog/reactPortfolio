import { useId, useState } from "react";
import { SectionFrame } from "@/components/section-frame";
import { InkRule } from "@/components/ink/ink-rule";
import { useInkReveal } from "@/lib/motion/use-ink-reveal";
import { faq } from "@/data/faq";
import { useRegister } from "@/lib/register";
import { cn } from "@/lib/utils";

function FaqItem({
  q,
  a,
  index,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  const { register } = useRegister();
  const poet = register === "poet";

  return (
    <div className="faq-item">
      <InkRule seed={index + 3} />
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="group grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-5 py-6 text-left md:gap-10 md:py-8"
        >
          <span className="font-mono text-sm text-muted-foreground/60">0{index + 1}</span>
          <span
            className={cn(
              "display text-xl text-foreground transition-colors group-hover:text-primary md:text-2xl",
              poet && "font-medium italic"
            )}
          >
            {q}
          </span>
          {/* an ink dot that swells open */}
          <span
            aria-hidden="true"
            className={cn(
              "faq-dot relative mt-1 block h-3 w-3 rounded-full border border-foreground/50 transition-all duration-500 ease-fluid",
              open && "border-primary bg-primary scale-125"
            )}
          />
        </button>
      </h3>
      <div
        id={id}
        role="region"
        className={cn("faq-panel grid", open && "is-open")}
        aria-hidden={!open}
      >
        <div className="faq-inner min-h-0 overflow-hidden">
          <p className="max-w-2xl pb-8 pl-[calc(1.25rem+1.25rem)] text-pretty leading-relaxed text-muted-foreground md:pl-[calc(1.25rem+2.5rem)]">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const listRef = useInkReveal<HTMLDivElement>({ stagger: 0.07, selector: ".faq-item" });

  return (
    <SectionFrame id="faq" eyebrow="FAQ" title="Questions, answered" note="short answers, no fluff">
      <div ref={listRef} className="flex flex-col">
        {faq.map((item, i) => (
          <FaqItem
            key={item.q}
            q={item.q}
            a={item.a}
            index={i}
            open={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
          />
        ))}
      </div>
    </SectionFrame>
  );
}
