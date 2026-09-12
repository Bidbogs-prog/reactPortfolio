import { useRef } from "react";
import { useParams } from "react-router-dom";
import { getWriting, formatDate } from "@/lib/writings";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { VerseReader } from "@/components/verse-reader";
import { InkLink } from "@/components/ink/ink-link";
import { InkHeadline } from "@/components/ink/ink-headline";
import { InkStamp, InkStampGroup } from "@/components/ink/ink-stamp";
import { InkProgress } from "@/components/ink/ink-progress";
import { InkBlots } from "@/components/ink/ink-blots";
import { InkRule } from "@/components/ink/ink-rule";
import { KindIcon } from "@/components/kind-icon";
import { useRegister } from "@/lib/register";
import NotFoundPage from "@/pages/not-found";
import { Seo, SITE_URL, SITE_NAME } from "@/components/seo";

export default function WritingPostPage() {
  const { slug } = useParams();
  const writing = slug ? getWriting(slug) : undefined;
  const bodyRef = useRef<HTMLDivElement>(null);
  const { register } = useRegister();

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
    <article className="relative min-h-screen overflow-hidden pt-32 pb-28">
      <Seo
        title={`${title} — ${SITE_NAME}`}
        description={summary}
        path={`/writings/${writing.slug}`}
        type="article"
        publishedTime={date}
        tags={tags}
        jsonLd={[articleLd, breadcrumbLd]}
      />
      {/* Poet register: a faint ink field behind the column */}
      {(isVerse || register === "poet") && (
        <InkBlots
          className="absolute inset-x-0 top-0 h-[70vh] opacity-[0.12]"
          intensity={0.6}
          interactive={false}
          every={6}
        />
      )}

      <InkProgress target={bodyRef} />

      <div className="container relative max-w-3xl">
        <InkLink
          to="/writings"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          All writings
        </InkLink>

        <header className={cn("mt-10", isVerse && "text-center")}>
          <div
            className={cn(
              "group flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground",
              isVerse && "justify-center"
            )}
          >
            <KindIcon kind={kind} className="h-3.5 w-3.5 text-primary" />
            <span className="text-primary">{kind}</span>
            <span className="h-px w-6 bg-foreground/25" />
            <time dateTime={date}>{formatDate(date)}</time>
          </div>

          <InkHeadline
            text={title}
            trigger="mount"
            delay={0.1}
            stagger={0.018}
            className={cn(
              "mt-6 text-balance text-[clamp(2.4rem,6vw,4.4rem)] leading-[1.02] text-foreground",
              isVerse && "font-serif font-medium italic",
              isProse && "font-serif font-medium",
              !isVerse && !isProse && "display ink-text tracking-[-0.03em]"
            )}
          />

          {tags && tags.length > 0 && (
            <InkStampGroup
              className={cn("mt-7 flex flex-wrap gap-2", isVerse && "justify-center")}
              stagger={0.05}
            >
              {tags.map((tag, i) => (
                <InkStamp key={tag} as="li" index={i} className="list-none">
                  {tag}
                </InkStamp>
              ))}
            </InkStampGroup>
          )}

          <InkRule seed={7} className="mt-10" />
        </header>

        <div ref={bodyRef}>
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
      </div>
    </article>
  );
}
