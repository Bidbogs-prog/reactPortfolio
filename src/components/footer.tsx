import { socials } from "@/data/socials";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 py-10">
      <div className="container flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-display text-sm font-semibold text-foreground">
            Haytham Chhilif
          </p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Designed &amp; built with care, &copy; {year}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
