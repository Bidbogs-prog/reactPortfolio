import { Head } from "vite-react-ssg";

/** Canonical origin for the site. No trailing slash. */
export const SITE_URL = "https://bidbogs.com";
export const SITE_NAME = "Haytham Chhilif";
export const TWITTER_HANDLE = "@HaythamChhilif";
export const DEFAULT_DESCRIPTION =
  "Haytham Chhilif is a full-stack and AI engineer building fast, thoughtful web apps with React, Next.js, and modern AI tooling.";
/** 1200x630 social card. Lives in /public. */
export const DEFAULT_OG_IMAGE = "/og.png";

function absolute(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export interface SeoProps {
  /** The full document title, e.g. "Writings — Haytham Chhilif". */
  title: string;
  description?: string;
  /** Route path beginning with "/", used for canonical + og:url. */
  path: string;
  type?: "website" | "article";
  /** Absolute URL or /public-relative path. */
  image?: string;
  /** ISO date — only emitted for type="article". */
  publishedTime?: string;
  tags?: string[];
  /** Keep the page out of search indexes (e.g. 404). */
  noindex?: boolean;
  /** One or more JSON-LD structured-data objects. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  type = "website",
  image = DEFAULT_OG_IMAGE,
  publishedTime,
  tags,
  noindex,
  jsonLd,
}: SeoProps) {
  const url = absolute(path);
  const img = absolute(image);
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta
        name="robots"
        content={
          noindex
            ? "noindex, follow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />

      {type === "article" && publishedTime ? (
        <meta property="article:published_time" content={publishedTime} />
      ) : null}
      {type === "article" && tags
        ? tags.map((tag) => (
            <meta property="article:tag" content={tag} key={tag} />
          ))
        : null}

      {blocks.map((block, i) => (
        <script type="application/ld+json" key={i}>
          {JSON.stringify(block)}
        </script>
      ))}
    </Head>
  );
}
