import { lazy, Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { RegisterProvider } from "@/lib/register";
import { AgentProvider, useAgent } from "@/lib/agent/agent-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Lazy — it's a closed overlay on load, so it shouldn't ship in the initial JS.
const CommandPalette = lazy(() =>
  import("@/components/command-palette").then((m) => ({
    default: m.CommandPalette,
  }))
);

/**
 * Mounts the command palette only after it's first opened, so its chunk loads
 * on demand instead of competing on the initial-load critical path.
 */
function CommandPaletteHost() {
  const { open } = useAgent();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);
  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <CommandPalette />
    </Suspense>
  );
}

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

/** Root layout shared by every route — providers, chrome, and the page outlet. */
export default function App() {
  return (
    <RegisterProvider>
      <AgentProvider>
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
            <Outlet />
          </main>

          <Footer />
          <CommandPaletteHost />
        </div>
      </AgentProvider>
    </RegisterProvider>
  );
}
