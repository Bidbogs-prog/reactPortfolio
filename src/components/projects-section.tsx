import type { ReactNode } from "react";
import { SectionFrame } from "@/components/section-frame";
import { InkLink } from "@/components/ink/ink-link";
import { InkStamp, InkStampGroup } from "@/components/ink/ink-stamp";
import { InkImage } from "@/components/ink/ink-image";
import { InkPlateProvider, useInkPlate } from "@/components/ink/ink-plate";
import { useInkReveal } from "@/lib/motion/use-ink-reveal";
import { projects } from "@/data/projects";
import { books } from "@/data/books";
import { writings, formatDate } from "@/lib/writings";
import { useRegister } from "@/lib/register";
import { KindIcon } from "@/components/kind-icon";
import { ArrowUpRight, Github } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjectsSection() {
  const { register } = useRegister();
  const isPoet = register === "poet";

  return (
    <SectionFrame
      id="work"
      num="02"
      eyebrow={isPoet ? "Words & Works" : "Selected Work"}
      title={isPoet ? "Things I've written & edited" : "Things I've *built*"}
      note={
        isPoet
          ? "hover a title: the cover soaks through"
          : "hover a title: the screenshot dissolves in"
      }
    >
      {isPoet ? <PoetWork /> : <EngineerWork />}
    </SectionFrame>
  );
}

/* ------------------------------------------------------------------ */

interface PlateRowProps {
  index: number;
  title: string;
  year: string;
  highlight?: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  href?: string;
  actions?: ReactNode;
  /** Stagger index offset for the stamps. */
  stampOffset?: number;
}

/**
 * One "plate": a full-width row where the title is set huge, the
 * highlight is stamped, and hovering pulls the screenshot up under the
 * cursor (full tier) or reveals it inline through an ink mask (lite).
 */
function PlateRow({
  index,
  title,
  year,
  highlight,
  description,
  tags,
  image,
  imageAlt,
  href,
  actions,
  stampOffset = 0,
}: PlateRowProps) {
  const plate = useInkPlate();
  const ref = useInkReveal<HTMLElement>({ y: 36 });
  const { register } = useRegister();
  const poet = register === "poet";

  const Title = href ? "a" : "span";

  return (
    <article
      ref={ref}
      className="plate-row group relative grid gap-6 py-12 lg:grid-cols-12 lg:gap-x-8 lg:py-16"
      onPointerEnter={() => plate.enabled && plate.show(image)}
      onPointerLeave={() => plate.enabled && plate.hide()}
    >
      {/* hand-inked rule */}
      <span aria-hidden="true" className="plate-rule" />

      <div className="flex items-start gap-4 lg:col-span-2 lg:flex-col lg:gap-3">
        <span className="font-display text-3xl leading-none text-foreground/25 lg:text-5xl">
          0{index + 1}
        </span>
        <InkStamp shape={poet ? "seal" : "rubber"} className="mt-1 lg:mt-0">
          {year}
        </InkStamp>
      </div>

      <div className="lg:col-span-6">
        <h3
          className={cn(
            "display ink-text text-[clamp(2.2rem,5.2vw,4.6rem)] leading-[0.95] tracking-[-0.03em] text-foreground",
            poet && "font-medium italic tracking-[-0.015em]"
          )}
        >
          <Title
            {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
            className="plate-title relative inline-block transition-colors duration-300 group-hover:text-primary"
          >
            {title}
            {href && (
              <ArrowUpRight
                aria-hidden="true"
                className="ml-2 inline-block h-[0.5em] w-[0.5em] -translate-y-[0.35em] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            )}
          </Title>
        </h3>

        {highlight && (
          <InkStampGroup className="mt-5 flex" stagger={0}>
            <InkStamp as="li" index={stampOffset} className="list-none" solid>
              {highlight}
            </InkStamp>
          </InkStampGroup>
        )}

        {!plate.enabled && (
          <InkImage src={image} alt={imageAlt} className="mt-8 max-w-xl" />
        )}
      </div>

      <div className="lg:col-span-4 lg:pt-3">
        <p className="text-pretty leading-relaxed text-muted-foreground">{description}</p>

        <InkStampGroup className="mt-6 flex flex-wrap gap-2" stagger={0.04}>
          {tags.map((tag, i) => (
            <InkStamp key={tag} as="li" index={stampOffset + i + 1} className="list-none">
              {tag}
            </InkStamp>
          ))}
        </InkStampGroup>

        {actions && <div className="mt-7 flex items-center gap-2">{actions}</div>}
      </div>
    </article>
  );
}

function PlateLink({
  href,
  children,
  muted,
}: {
  href: string;
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "ink-fill-btn flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all",
        muted
          ? "border-foreground/15 text-muted-foreground"
          : "border-foreground/30 text-foreground"
      )}
    >
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */

function EngineerWork() {
  return (
    <InkPlateProvider images={projects.map((p) => p.image)}>
      <div className="flex flex-col">
        {projects.map((project, i) => (
          <PlateRow
            key={project.id}
            index={i}
            title={project.title}
            year={project.year}
            highlight={project.highlight}
            description={project.description}
            tags={project.tags}
            image={project.image}
            imageAlt={`${project.title} screenshot`}
            href={project.demoUrl}
            stampOffset={i * 9}
            actions={
              <>
                <PlateLink href={project.demoUrl}>
                  Live
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </PlateLink>
                <PlateLink href={project.githubUrl} muted>
                  Code
                  <Github className="h-3.5 w-3.5" />
                </PlateLink>
              </>
            }
          />
        ))}
      </div>

      <div className="relative mt-4 pt-10">
        <span aria-hidden="true" className="plate-rule" />
        <a
          href="https://github.com/Bidbogs-prog"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <span className="text-primary">&#47;&#47;</span>
          More on GitHub
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </InkPlateProvider>
  );
}

function PoetWork() {
  const featured = writings.slice(0, 4);
  const featuredRef = useInkReveal<HTMLDivElement>({ stagger: 0.08 });

  return (
    <InkPlateProvider images={books.map((b) => b.image)}>
      <div className="flex flex-col">
        {books.map((book, i) => (
          <PlateRow
            key={book.id}
            index={i}
            title={book.title}
            year={book.year}
            highlight={book.role}
            description={book.description}
            tags={["Short stories", "EN / AR", book.publisher]}
            image={book.image}
            imageAlt={`${book.title} cover`}
            stampOffset={i * 9}
          />
        ))}
      </div>

      {/* Featured writings */}
      <div className="relative mt-6 pt-12">
        <span aria-hidden="true" className="plate-rule" />
        <h3 className="mb-8 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
          <span className="text-primary">¶</span>
          From the desk
        </h3>

        <div ref={featuredRef} className="grid gap-x-10 gap-y-2 sm:grid-cols-2">
          {featured.map((w) => (
            <InkLink
              key={w.slug}
              to={`/writings/${w.slug}`}
              className="group relative flex flex-col gap-2 py-6"
            >
              <span aria-hidden="true" className="plate-rule" />
              <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-wider text-muted-foreground">
                <KindIcon kind={w.kind} className="h-3 w-3 text-primary" />
                {w.kind}
                <span className="text-muted-foreground/50">·</span>
                {formatDate(w.date)}
              </span>
              <span className="font-display text-2xl font-medium italic leading-tight text-foreground transition-colors group-hover:text-primary">
                {w.title}
              </span>
              <span className="line-clamp-2 text-sm text-muted-foreground">{w.summary}</span>
            </InkLink>
          ))}
        </div>

        <div className="mt-10">
          <InkLink
            to="/writings"
            className="group inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <span className="text-primary">¶</span>
            Read all writings
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </InkLink>
        </div>
      </div>
    </InkPlateProvider>
  );
}
