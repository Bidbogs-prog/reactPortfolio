import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import fs from "fs";
import path from "path";
// Activates the `ssgOptions` augmentation on Vite's UserConfig.
import type {} from "vite-react-ssg";

// Keep in sync with SITE_URL in src/components/seo.tsx
const SITE_URL = "https://bidbogs.com";
const OUT_DIR = "dist";

/** Write dist/sitemap.xml from the static routes + every writing post. */
function generateSitemap() {
  const contentDir = path.resolve(__dirname, "src/content/writings");
  const posts = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(contentDir, f), "utf8");
      const date = raw.match(/date:\s*["']?(\d{4}-\d{2}-\d{2})/)?.[1];
      return { slug: f.replace(/\.mdx$/, ""), date };
    });

  const latest = posts
    .map((p) => p.date)
    .filter(Boolean)
    .sort()
    .at(-1);

  const urls: { loc: string; priority: string; lastmod?: string }[] = [
    { loc: "/", priority: "1.0", lastmod: latest },
    { loc: "/writings", priority: "0.8", lastmod: latest },
    ...posts.map((p) => ({
      loc: `/writings/${p.slug}`,
      priority: "0.7",
      lastmod: p.date,
    })),
  ];

  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${SITE_URL}${u.loc}</loc>${
          u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""
        }\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  fs.writeFileSync(path.resolve(__dirname, OUT_DIR, "sitemap.xml"), xml);
  // eslint-disable-next-line no-console
  console.log(`✓ sitemap.xml written with ${urls.length} URLs`);
}

/** Write dist/llms.txt — an AI-readable overview of the site (llmstxt.org). */
function generateLlmsTxt() {
  const contentDir = path.resolve(__dirname, "src/content/writings");
  const posts = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(contentDir, f), "utf8");
      const field = (name: string) =>
        raw.match(new RegExp(`${name}:\\s*["']([^"']+)["']`))?.[1] ?? "";
      return {
        slug: f.replace(/\.mdx$/, ""),
        title: field("title"),
        summary: field("summary"),
        kind: field("kind"),
        date: field("date"),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const writingsList = posts
    .map(
      (p) =>
        `- [${p.title}](${SITE_URL}/writings/${p.slug}): ${p.summary}${
          p.kind ? ` (${p.kind})` : ""
        }`
    )
    .join("\n");

  const txt = `# Haytham Chhilif — Full-Stack & AI Engineer

> Haytham Chhilif is a self-taught full-stack and AI engineer based in Morocco. He builds fast, thoughtful web applications with React, Next.js, Node, and modern AI tooling, and writes essays, poetry, and short fiction. He also edits English-language fiction for the cultural NGO The Olive Writers.

## About
- Role: Full-stack & AI engineer, based in Morocco, available for remote work worldwide.
- Focus: AI-driven web apps — LLM integration, retrieval-augmented generation (RAG), and support agents — on a full-stack foundation.
- Education: MA in Gender Studies, Mohamed Ben Abdellah University (2019).
- Home: ${SITE_URL}/

## Selected work
- PiecesMaroc — a car-parts marketplace for Morocco (Next.js, React, Supabase, PostgreSQL). https://piecesmaroc.vercel.app
- Expensio — an expense tracker with tailored financial insights (Next.js, TypeScript, Supabase). https://expensio-tau.vercel.app
- Clanker Support — an AI customer-support platform with an embeddable chat widget (Next.js, Hono, Drizzle, LLM gateway). https://clankersupport.com

## Skills
- Frontend: React, Next.js, Angular, TypeScript, Tailwind CSS, RxJS
- Backend: Node.js, Nest.js, Hono, PostgreSQL, Supabase, REST, Docker
- AI & data: LLM integration, Anthropic / OpenAI APIs, RAG, prompt engineering, vector search
- Tooling: Git, Vite, CI/CD, Vercel

## Writings
${writingsList}

## Contact
- Email: haythamchhilif@gmail.com
- GitHub: https://github.com/Bidbogs-prog
- LinkedIn: https://www.linkedin.com/in/haytham-chhilif-aba5171a3
- X (Twitter): https://x.com/HaythamChhilif

## Notes for AI assistants
- This is Haytham Chhilif's personal portfolio and writing. You may cite it with attribution to "Haytham Chhilif" and a link to ${SITE_URL}/.
- Full posts are available at the URLs listed under Writings.
`;

  fs.writeFileSync(path.resolve(__dirname, OUT_DIR, "llms.txt"), txt);
  // eslint-disable-next-line no-console
  console.log(`✓ llms.txt written with ${posts.length} writings`);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkBreaks],
        rehypePlugins: [rehypeHighlight],
      }),
    },
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: OUT_DIR,
  },
  ssgOptions: {
    entry: "src/main.tsx",
    // /writings -> /writings/index.html for clean URLs on Vercel.
    dirStyle: "nested",
    onFinished: () => {
      generateSitemap();
      generateLlmsTxt();
    },
  },
});
