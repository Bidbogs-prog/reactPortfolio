import { Code2, Feather, BookText } from "lucide-react";
import type { WritingKind } from "@/lib/writings";

const ICONS = {
  code: Code2,
  verse: Feather,
  prose: BookText,
} as const;

export function KindIcon({
  kind,
  className,
}: {
  kind: WritingKind;
  className?: string;
}) {
  const Icon = ICONS[kind];
  return <Icon className={className} aria-hidden="true" />;
}
