import { useRef, type PointerEvent } from "react";
import { SectionFrame } from "@/components/section-frame";
import { InkStamp, InkStampGroup } from "@/components/ink/ink-stamp";
import { useInkReveal } from "@/lib/motion/use-ink-reveal";
import { contributions, type Contribution } from "@/data/contributions";
import { useRegister } from "@/lib/register";
import { ArrowUpRight } from "lucide-react";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * A collaboration "seal": a plate that tilts toward the cursor with an ink
 * sheen following it, a big circular seal carrying the site's initial, and
 * the hostname stamped along the bottom.
 */
function SealCard({ c, index }: { c: Contribution; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width;
    const my = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${mx * 100}%`);
    el.style.setProperty("--my", `${my * 100}%`);
    el.style.setProperty("--rx", `${(0.5 - my) * 10}deg`);
    el.style.setProperty("--ry", `${(mx - 0.5) * 12}deg`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <a
      ref={ref}
      href={c.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${c.name}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="seal-card group relative flex min-h-[19rem] flex-col justify-between overflow-hidden p-7"
    >
      <span aria-hidden="true" className="seal-sheen" />
      <span aria-hidden="true" className="seal-corner seal-corner-tl" />
      <span aria-hidden="true" className="seal-corner seal-corner-br" />

      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-muted-foreground/70">
          collab / 0{index + 1}
        </span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>

      <div className="relative mt-8">
        {/* the seal */}
        <span aria-hidden="true" className="seal-mark">
          {c.name.charAt(0)}
        </span>
        <h3 className="display ink-text relative text-3xl text-foreground transition-colors group-hover:text-primary md:text-4xl">
          {c.name}
        </h3>
        <p className="relative mt-3 max-w-[26ch] text-pretty text-sm leading-relaxed text-muted-foreground">
          {c.description}
        </p>
      </div>

      <div className="relative mt-8 flex flex-wrap items-end justify-between gap-3">
        <InkStampGroup className="flex flex-wrap gap-2" stagger={0.06}>
          {c.tags.map((tag, i) => (
            <InkStamp key={tag} as="li" index={index * 5 + i} className="list-none">
              {tag}
            </InkStamp>
          ))}
        </InkStampGroup>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground/70">
          {hostOf(c.url)}
        </span>
      </div>
    </a>
  );
}

export default function ContributionsSection() {
  const { register } = useRegister();
  const gridRef = useInkReveal<HTMLDivElement>({ stagger: 0.12, y: 40 });

  // Professional web collaborations belong to the engineer side only.
  if (register === "poet") return null;

  return (
    <SectionFrame
      id="contributions"
      num="03"
      eyebrow="Collaborations"
      title="Sites I've *contributed* to"
      note="client and studio work, sealed"
    >
      <div ref={gridRef} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {contributions.map((c, i) => (
          <SealCard key={c.id} c={c} index={i} />
        ))}
      </div>
    </SectionFrame>
  );
}
