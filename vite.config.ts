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

  const urls: { loc: string; priority: string; lastmod?: string }[] = [
    { loc: "/", priority: "1.0" },
    { loc: "/writings", priority: "0.8" },
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
    onFinished: generateSitemap,
  },
});
