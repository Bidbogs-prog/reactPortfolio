import { socials } from "@/data/socials";
import { InkHeadline } from "@/components/ink/ink-headline";
import { InkDivider } from "@/components/ink/ink-divider";
import { InkLink } from "@/components/ink/ink-link";
import { useSmoothScroll } from "@/lib/motion/smooth-scroll";
import { useRegister } from "@/lib/register";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Footer() {
  const year = new Date().getFullYear();
  const { scrollTo } = useSmoothScroll();
  const { register } = useRegister();
  const poet = register === "poet";

  return (
    <footer className="relative overflow-hidden pt-6">
      <InkDivider />

      <div className="container">
        {/* The name, viewport-wide, fills with ink as you reach the bottom */}
        <InkHeadline
          as="p"
          text={poet ? "haytham chhilif" : "HAYTHAM CHHILIF"}
          trigger="scrub"
          stagger={0.02}
          className={cn(
            "display ink-text mt-10 whitespace-nowrap text-[clamp(2.6rem,9.6vw,11rem)] leading-none tracking-[-0.05em] text-foreground",
            poet && "font-medium italic tracking-[-0.02em]"
          )}
        />

        <div className="mt-10 flex flex-col items-start justify-between gap-8 pb-10 sm:flex-row sm:items-end">
          <div>
            <p className="marginalia">
              {poet ? "written, coded, and inked by hand" : "designed & built with care"}
              {" · "}&copy; {year}
            </p>
            <nav className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <InkLink to="/" className="transition-colors hover:text-primary">
                Home
              </InkLink>
              <InkLink to="/writings" className="transition-colors hover:text-primary">
                Writings
              </InkLink>
              <a href="mailto:haythamchhilif@gmail.com" className="transition-colors hover:text-primary">
                Email
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/25 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
            <button
              type="button"
              onClick={() => scrollTo(0)}
              aria-label="Back to top"
              className="ink-fill-btn ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/25 text-muted-foreground transition-all hover:-translate-y-0.5"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
