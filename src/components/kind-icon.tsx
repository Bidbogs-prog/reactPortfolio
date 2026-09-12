import type { WritingKind } from "@/lib/writings";
import { cn } from "@/lib/utils";

/**
 * A tiny ink stroke for each kind of writing: a curl for verse, a dash for
 * prose, a bracket for code. Drawn on hover of the parent `.group`.
 */
const STROKES: Record<WritingKind, string> = {
  verse: "M3 14 C 5 4, 11 4, 11 10 C 11 16, 5 15, 7 9 C 8 6, 13 5, 15 8",
  prose: "M2 9 Q 8 6 16 9",
  code: "M8 3 L 3 9 L 8 15 M10 3 L 15 9 L 10 15",
};

export function KindIcon({
  kind,
  className,
}: {
  kind: WritingKind;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 18 18"
      aria-hidden="true"
      className={cn("kind-stroke shrink-0 overflow-visible", className)}
    >
      <path
        d={STROKES[kind]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
