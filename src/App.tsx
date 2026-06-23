import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CommandPalette } from "@/components/command-palette";
import HomePage from "@/pages/home";
import WritingsPage from "@/pages/writings";
import WritingPostPage from "@/pages/writing-post";
import NotFoundPage from "@/pages/not-found";

/** Scroll to top on route change, or to a hash target if present. */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <div className="grain relative min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <ScrollManager />
      <Navbar />

      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/writings" element={<WritingsPage />} />
          <Route path="/writings/:slug" element={<WritingPostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <CommandPalette />
    </div>
  );
}
