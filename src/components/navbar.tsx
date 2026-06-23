import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, ArrowUpRight, Feather } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RegisterToggle } from "@/components/register-toggle";
import { cn } from "@/lib/utils";

const SECTION_LINKS = [
  { id: "about", label: "About", num: "01" },
  { id: "work", label: "Work", num: "02" },
  { id: "contact", label: "Contact", num: "03" },
];

const HOME_SECTION_IDS = ["hero", "about", "work", "contact"];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    HOME_SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  const goToSection = (id: string) => {
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "border-b border-border/60 bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <nav className="container flex items-center justify-between py-4">
        <Link
          to="/"
          className="group flex items-center gap-2"
          aria-label="Home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card font-display text-sm font-bold text-foreground transition-colors group-hover:border-primary group-hover:text-primary">
            HC
          </span>
          <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            Chhilif
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {SECTION_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => goToSection(link.id)}
              className={cn(
                "group flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors",
                isHome && active === link.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="font-mono text-[0.65rem] text-primary/70">
                {link.num}.
              </span>
              {link.label}
            </button>
          ))}
          <NavLink
            to="/writings"
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <Feather className="h-3.5 w-3.5 text-primary/70" />
            Writings
          </NavLink>

          <div className="mx-2">
            <RegisterToggle />
          </div>

          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-primary/40 font-mono text-xs hover:bg-primary hover:text-primary-foreground"
          >
            <a href="mailto:haythamchhilif@gmail.com">
              Let&apos;s talk
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <RegisterToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-border bg-card/95 backdrop-blur-xl"
            >
              <div className="mt-12 flex flex-col gap-2">
                {SECTION_LINKS.map((link) => (
                  <SheetTrigger asChild key={link.id}>
                    <button
                      onClick={() => goToSection(link.id)}
                      className="flex items-baseline gap-3 rounded-lg px-3 py-3 text-left font-display text-2xl font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      <span className="font-mono text-sm text-primary/70">
                        {link.num}
                      </span>
                      {link.label}
                    </button>
                  </SheetTrigger>
                ))}
                <SheetTrigger asChild>
                  <Link
                    to="/writings"
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-left font-display text-2xl font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    <Feather className="h-5 w-5 text-primary/70" />
                    Writings
                  </Link>
                </SheetTrigger>
                <SheetTrigger asChild>
                  <a
                    href="mailto:haythamchhilif@gmail.com"
                    className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-mono text-sm font-medium text-primary-foreground"
                  >
                    Let&apos;s talk
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </SheetTrigger>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
