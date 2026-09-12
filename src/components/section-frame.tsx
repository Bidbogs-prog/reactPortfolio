import type { ReactNode } from "react";
import { InkDivider } from "@/components/ink/ink-divider";
import { InkHeadline } from "@/components/ink/ink-headline";
import { useInkReveal } from "@/lib/motion/use-ink-reveal";
import { useRegister } from "@/lib/register";
import { cn } from "@/lib/utils";

interface SectionFrameProps {
  id: string;
  /** "01".."04". Drawn huge and faint behind the heading. */
  num?: string;
  eyebrow: string;
  title: string;
  /** Mono marginalia in the right gutter on wide screens. */
  note?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Skip the ink divider at the top (e.g. the first section after the hero). */
  noDivider?: boolean;
  /** Extra content rendered beside the heading (right column). */
  aside?: ReactNode;
}

/**
 * The shell every home section sits in. Breaks the centred-container look:
 * a giant faint numeral overlapping the heading from the left, a rotated
 * running label in the margin, marginalia on the right, an ink divider at
 * the top and plotter registration marks (engineer) at the corners.
 */
export function SectionFrame({
  id,
  num,
  eyebrow,
  title,
  note,
  children,
  className,
  noDivider,
  aside,
}: SectionFrameProps) {
  const { register } = useRegister();
  const headRef = useInkReveal<HTMLDivElement>({ stagger: 0.08 });
  const engineer = register === "engineer";

  return (
    <section id={id} className={cn("section-frame relative", className)}>
      {!noDivider && <InkDivider />}

      {engineer && (
        <>
          <span aria-hidden="true" className="reg-mark reg-mark-tl" />
          <span aria-hidden="true" className="reg-mark reg-mark-tr" />
        </>
      )}

      <div className="container relative pb-24 pt-20 md:pb-32 md:pt-28">
        {/* Running label in the margin */}
        <span
          aria-hidden="true"
          className="running-label hidden xl:block"
        >
          {eyebrow} {num ? `/ ${num}` : ""}
        </span>

        {/* Giant faint numeral */}
        {num && (
          <span aria-hidden="true" className="section-numeral">
            {num}
          </span>
        )}

        <div className="relative grid gap-8 lg:grid-cols-12" ref={headRef}>
          <div className="lg:col-span-8">
            <span className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-primary/60" />
              {eyebrow}
            </span>
            <InkHeadline
              as="h2"
              text={title}
              className="display ink-text mt-5 text-balance text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.95] text-foreground"
              stagger={0.02}
            />
          </div>
          {(note || aside) && (
            <div className="lg:col-span-4 lg:flex lg:flex-col lg:items-end lg:justify-end">
              {aside}
              {note && (
                <p className="marginalia mt-4 max-w-[16rem] lg:text-right">{note}</p>
              )}
            </div>
          )}
        </div>

        <div className="relative mt-14 md:mt-20">{children}</div>
      </div>
    </section>
  );
}
