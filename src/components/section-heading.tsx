import { Reveal } from "@/components/reveal";

interface SectionHeadingProps {
  num?: string;
  eyebrow: string;
  title: string;
}

export function SectionHeading({ num, eyebrow, title }: SectionHeadingProps) {
  return (
    <Reveal>
      <div className="mb-12 flex flex-col gap-4 md:mb-16">
        <span className="eyebrow flex items-center gap-3">
          {num ? <span className="text-muted-foreground/50">{num}</span> : null}
          <span className="inline-block h-px w-8 bg-primary/50" />
          {eyebrow}
        </span>
        <h2 className="display text-balance text-4xl text-foreground sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </div>
    </Reveal>
  );
}
