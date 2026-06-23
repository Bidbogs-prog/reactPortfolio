import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-primary">
        404
      </p>
      <h1 className="display mt-4 text-5xl text-foreground md:text-6xl">
        Lost the thread
      </h1>
      <p className="mt-4 max-w-md text-pretty text-muted-foreground">
        This page wandered off, or never existed. Let&apos;s get you back to
        something real.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
      >
        Back home
      </Link>
    </section>
  );
}
