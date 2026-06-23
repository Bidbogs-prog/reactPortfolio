import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { projects } from "@/data/projects";
import { books } from "@/data/books";
import { writings, formatDate } from "@/lib/writings";
import { useRegister } from "@/lib/register";
import { KindIcon } from "@/components/kind-icon";
import { ArrowUpRight, Github, BookOpen, Feather } from "lucide-react";

export default function ProjectsSection() {
  const { register } = useRegister();
  const isPoet = register === "poet";

  return (
    <section
      id="work"
      className="relative border-t border-border/60 bg-muted/20 py-24 md:py-32"
    >
      <div className="container">
        <SectionHeading
          num="02"
          eyebrow={isPoet ? "Words & Works" : "Selected Work"}
          title={isPoet ? "Things I've written & edited" : "Things I've built"}
        />

        {isPoet ? <PoetWork /> : <EngineerWork />}
      </div>
    </section>
  );
}

function EngineerWork() {
  return (
    <>
      <div className="flex flex-col">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 60}>
            <article className="group relative grid gap-6 border-t border-border/60 py-10 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-10">
              <div className="font-mono text-sm text-muted-foreground/60">
                0{i + 1}
              </div>

              <div className="max-w-2xl">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="font-display text-2xl font-semibold text-foreground transition-colors group-hover:text-primary md:text-3xl">
                    {project.title}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {project.year}
                  </span>
                </div>

                {project.highlight && (
                  <p className="mt-2 text-sm font-medium text-primary/90">
                    {project.highlight}
                  </p>
                )}

                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-xs text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-2 md:flex-col md:items-end">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title} live`}
                  className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                >
                  Live
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title} source on GitHub`}
                  className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-foreground/40 hover:text-foreground"
                >
                  Code
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-12 border-t border-border/60 pt-10">
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
      </Reveal>
    </>
  );
}

function PoetWork() {
  const featured = writings.slice(0, 4);

  return (
    <div className="flex flex-col gap-16">
      {/* Published books */}
      <div>
        <Reveal>
          <h3 className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            Published — editor, The Olive Writers
          </h3>
        </Reveal>

        <div className="flex flex-col">
          {books.map((book, i) => (
            <Reveal key={book.id} delay={i * 60}>
              <article className="grid gap-4 border-t border-border/60 py-8 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-10">
                <div className="font-mono text-sm text-muted-foreground/60">
                  0{i + 1}
                </div>

                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h4 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
                      {book.title}
                    </h4>
                    <span className="font-mono text-xs text-muted-foreground">
                      {book.year}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-primary/90">
                    {book.role}
                  </p>
                  <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                    {book.description}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {["Short stories", "EN / AR", book.publisher].map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-xs text-muted-foreground"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:text-right">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
                    Print
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Featured writings */}
      <div>
        <Reveal>
          <h3 className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Feather className="h-3.5 w-3.5 text-primary" />
            From the desk
          </h3>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((w, i) => (
            <Reveal key={w.slug} delay={i * 60}>
              <Link
                to={`/writings/${w.slug}`}
                className="group flex h-full flex-col rounded-xl border border-border bg-card/50 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50"
              >
                <span className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                  <KindIcon kind={w.kind} className="h-3 w-3 text-primary" />
                  {w.kind}
                  <span className="text-muted-foreground/50">·</span>
                  {formatDate(w.date)}
                </span>
                <h4 className="mt-2 font-display text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                  {w.title}
                </h4>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                  {w.summary}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 border-t border-border/60 pt-8">
            <Link
              to="/writings"
              className="group inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <span className="text-primary">&#47;&#47;</span>
              Read all writings
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
