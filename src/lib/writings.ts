import type { ComponentType } from "react";

/** An MDX default export accepts an optional `components` override map. */
export type MdxComponent = ComponentType<{
  components?: Record<string, ComponentType<Record<string, unknown>>>;
}>;

export type WritingKind = "code" | "verse" | "prose";

export interface WritingFrontmatter {
  title: string;
  date: string; // ISO yyyy-mm-dd
  kind: WritingKind;
  summary: string;
  tags?: string[];
}

export interface Writing extends WritingFrontmatter {
  slug: string;
  Component: MdxComponent;
}

interface MdxModule {
  frontmatter: WritingFrontmatter;
  default: MdxComponent;
}

// Eagerly load every post so we can build the index synchronously.
const modules = import.meta.glob<MdxModule>("../content/writings/*.mdx", {
  eager: true,
});

function slugFromPath(path: string): string {
  return path.split("/").pop()!.replace(/\.mdx$/, "");
}

export const writings: Writing[] = Object.entries(modules)
  .map(([path, mod]) => ({
    slug: slugFromPath(path),
    Component: mod.default,
    ...mod.frontmatter,
  }))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getWriting(slug: string): Writing | undefined {
  return writings.find((w) => w.slug === slug);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
