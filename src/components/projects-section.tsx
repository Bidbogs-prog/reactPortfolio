import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { projects } from "@/data/projects";
import { ArrowUpRight, Github } from "lucide-react";

export default function ProjectsSection() {
  return (
    <section
      id="work"
      className="relative border-t border-border/60 bg-muted/20 py-24 md:py-32"
    >
      <div className="container">
        <SectionHeading
          num="02"
          eyebrow="Selected Work"
          title="Things I've built"
        />

        <div className="flex flex-col">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 60}>
              <article className="group relative grid gap-6 border-t border-border/60 py-10 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-10">
                {/* Index */}
                <div className="font-mono text-sm text-muted-foreground/60">
                  0{i + 1}
                </div>

                {/* Body */}
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

                {/* Links */}
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
      </div>
    </section>
  );
}
