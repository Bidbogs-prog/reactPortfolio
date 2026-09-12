import { Seo, SITE_NAME } from "@/components/seo";
import { InkFluid } from "@/components/ink/ink-fluid";
import { InkHeadline } from "@/components/ink/ink-headline";
import { InkLines } from "@/components/ink/ink-lines";
import { InkLink } from "@/components/ink/ink-link";
import { useRegister } from "@/lib/register";
import { cn } from "@/lib/utils";

export default function NotFoundPage() {
  const { register } = useRegister();
  const poet = register === "poet";

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      <Seo
        title={`Page not found — ${SITE_NAME}`}
        description="This page wandered off, or never existed."
        path="/404"
        noindex
      />
      <InkFluid className="absolute inset-0 h-full w-full" firstDrop={{ x: 0.5, y: 0.45 }} />

      <div className="relative">
        <InkHeadline
          as="p"
          text="404"
          trigger="mount"
          className={cn(
            "display ink-text text-[clamp(6rem,24vw,18rem)] leading-none tracking-[-0.06em] text-foreground",
            poet && "font-medium italic"
          )}
        />
        <InkHeadline
          as="h1"
          text={poet ? "The page *slipped* away" : "Lost the *thread*"}
          trigger="mount"
          delay={0.4}
          className={cn(
            "display mt-2 text-3xl text-foreground md:text-5xl",
            poet && "font-medium italic"
          )}
        />
        <InkLines trigger="mount" delay={0.7} className="mx-auto mt-5 max-w-md text-pretty text-muted-foreground">
          This page wandered off, or never existed. Let&apos;s get you back to something real.
        </InkLines>
        <InkLink
          to="/"
          className="mt-9 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Back home
        </InkLink>
      </div>
    </section>
  );
}
