import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { MdxComponent } from "@/lib/writings";
import { cn } from "@/lib/utils";

/** Split a paragraph's mixed children (text + <br/>) into discrete lines. */
function splitLines(children: ReactNode): ReactNode[][] {
  const lines: ReactNode[][] = [];
  let current: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === "br") {
      lines.push(current);
      current = [];
    } else {
      current.push(child);
    }
  });
  lines.push(current);
  return lines.filter(
    (line) =>
      line.length > 0 &&
      !(line.length === 1 && typeof line[0] === "string" && !line[0].trim())
  );
}

/** Renders each stanza as a stack of individually-revealable lines. */
function PoemParagraph({ children }: { children?: ReactNode }) {
  const lines = splitLines(children);
  return (
    <p>
      {lines.map((line, i) => (
        <span className="poem-line" key={i}>
          {line}
        </span>
      ))}
    </p>
  );
}

const poemComponents = {
  p: PoemParagraph as MdxComponent,
};

interface VerseReaderProps {
  Component: MdxComponent;
  className?: string;
}

export function VerseReader({ Component, className }: VerseReaderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const lines = Array.from(root.querySelectorAll<HTMLElement>(".poem-line"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lines.forEach((l) => l.classList.add("is-lit"));
      return;
    }

    // IntersectionObserver fires only on threshold crossings — no scroll loop.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-lit");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -22% 0px", threshold: 0 }
    );

    lines.forEach((l) => io.observe(l));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("poem", className)}>
      <Component components={poemComponents} />
    </div>
  );
}
