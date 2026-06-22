import type { ElementType, ReactNode } from "react";
import { useReveal } from "@/lib/hooks/use-reveal";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in ms applied via CSS custom property. */
  delay?: number;
  className?: string;
  /** Render as a different element (e.g. "li", "section"). */
  as?: ElementType;
}

/**
 * Wraps content in a scroll-triggered fade/slide-up reveal.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      className={cn("reveal", isVisible && "is-visible", className)}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
