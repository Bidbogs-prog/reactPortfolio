import { Link, useParams } from "react-router-dom";
import { getWriting, formatDate } from "@/lib/writings";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { VerseReader } from "@/components/verse-reader";
import NotFoundPage from "@/pages/not-found";
import { Seo, SITE_URL, SITE_NAME } from "@/components/seo";

export default function WritingPostPage() {
  const { slug } = useParams();
  const writing = slug ? getWriting(slug) : undefined;

  if (!writing) return <NotFoundPage />;

  const { Component, title, date, kind, tags, summary } = writing;
  const isVerse = kind === "verse";
  const isProse = kind === "prose";

  const url = `${SITE_URL}/writings/${writing.slug}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: summary,
    datePublished: date,
    dateModified: date,
    url,
    image: `${SITE_URL}/og.png`,
    inLanguage: "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
    ...(tags && tags.length > 0 ? { keywords: tags.join(", ") } : {}),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Writings",
        item: `${SITE_URL}/writings`,
      },
      { "@type": "ListItem", position: 3, name: title, item: url },
    ],
  };

  return (
    <article className="relative min-h-screen pt-32 pb-28">
      <Seo
        title={`${title} — ${SITE_NAME}`}
        description={summary}
        path={`/writings/${writing.slug}`}
        type="article"
        publishedTime={date}
        tags={tags}
        jsonLd={[articleLd, breadcrumbLd]}
      />
      <div className="container relative max-w-3xl">
        <Link
          to="/writings"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          All writings
        </Link>

        <header className={cn("mt-8", isVerse && "text-center")}>
          <div
            className={cn(
              "flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-muted-foreground",
              isVerse && "justify-center"
            )}
          >
            <span className="text-primary">{kind}</span>
            <span className="h-px w-6 bg-border" />
            <time dateTime={date}>{formatDate(date)}</time>
          </div>

          <h1
            className={cn(
              "mt-5 text-balance text-4xl text-foreground md:text-5xl",
              isVerse && "font-serif italic",
              isProse && "font-serif",
              !isVerse && !isProse && "display"
            )}
          >
            {title}
          </h1>

          {tags && tags.length > 0 && (
            <ul
              className={cn(
                "mt-5 flex flex-wrap gap-2",
                isVerse && "justify-center"
              )}
            >
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md border border-border bg-card px-2.5 py-1 font-mono text-xs text-muted-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        {isVerse ? (
          <VerseReader
            key={slug}
            Component={Component}
            className="mx-auto mt-12 max-w-xl"
          />
        ) : (
          <div className={cn("mt-12", isProse ? "prose-story" : "prose-hc")}>
            <Component />
          </div>
        )}
      </div>
    </article>
  );
}
