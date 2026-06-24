/// <reference types="vite/client" />

declare module "*.mdx" {
  import type { ComponentType } from "react";

  /** Frontmatter exported by remark-mdx-frontmatter. */
  export const frontmatter: Record<string, unknown>;
  const MDXComponent: ComponentType<{
    components?: Record<string, ComponentType<Record<string, unknown>>>;
  }>;
  export default MDXComponent;
}

interface ImportMetaEnv {
  /** Optional: set when a real agent backend endpoint is wired up. */
  readonly VITE_AGENT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
