import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, ArrowUpRight, Feather } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RegisterToggle } from "@/components/register-toggle";
import { InkLink } from "@/components/ink/ink-link";
import { useSmoothScroll } from "@/lib/motion/smooth-scroll";
import { useRegister } from "@/lib/register";
import { cn } from "@/lib/utils";

const ENGINEER_LINKS = [
  { id: "about", label: "About", num: "01" },
  { id: "work", label: "Work", num: "02" },
  { id: "contributions", label: "Contributed", num: "03" },
  { id: "contact", label: "Contact", num: "04" },
];

// The poet side has no "Contributed" section, so Contact moves up to 03.
const POET_LINKS = [
  { id: "about", label: "About", num: "01" },
  { id: "work", label: "Work", num: "02" },
  { id: "contact", label: "Contact", num: "03" },
];

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** A small ink blot with the initials cut out of it. */
function Mark() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
      <path
        className="fill-foreground transition-colors duration-300 group-hover:fill-primary"
        d="M20.5 2.5c6-.6 11.5 2.4 14.6 7.4 2.6 4.3 3.5 9.9 1.2 14.6-2.3 4.8-7.1 8.2-12.2 9.6-5 1.3-10.9.9-14.9-2.5C5.3 28.4 3.2 22.6 4 17.3 5 11.1 9.6 5.6 15.4 3.5c1.7-.6 3.4-.9 5.1-1Z"
        style={{ filter: "url(#ink-seal)" }}
      />
      <text
        x="20"
        y="25"
        textAnchor="middle"
        className="fill-background font-display text-[13px] font-bold"
        style={{ letterSpacing: "-0.04em" }}
      >
        HC
      </text>
    </svg>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useRegister();
  const { scrollTo } = useSmoothScroll();
  const isHome = location.pathname === "/";
  const listRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  const sectionLinks = register === "poet" ? POET_LINKS : ENGINEER_LINKS;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const ids = ["hero", ...sectionLinks.map((l) => l.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome, sectionLinks]);

  // Slide the ink dot under the active link and let it smear as it moves.
  useIsoLayoutEffect(() => {
    const list = listRef.current;
    const dot = dotRef.current;
    if (!list || !dot) return;
    const target = list.querySelector<HTMLElement>(`[data-nav="${active}"]`);
    if (!isHome || !target) {
      dot.style.opacity = "0";
      return;
    }
    const x = target.offsetLeft + target.offsetWidth / 2;
    dot.style.opacity = "1";
    dot.style.transform = `translateX(${x}px) translateX(-50%)`;
    dot.classList.remove("is-smearing");
    // Force a reflow so re-adding the class restarts the keyframe.
    void dot.offsetWidth;
    dot.classList.add("is-smearing");
  }, [active, isHome, sectionLinks]);

  const goToSection = (id: string) => {
    if (isHome) scrollTo(id);
    else navigate(`/#${id}`);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500",
        isScrolled
          ? "border-b border-foreground/10 bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <nav className="container flex items-center justify-between py-3">
        <InkLink to="/" className="group flex items-center gap-2.5" aria-label="Home">
          <Mark />
          <span className="hidden font-mono text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground sm:inline">
            Chhilif
          </span>
        </InkLink>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          <div ref={listRef} className="relative flex items-center gap-1">
            {sectionLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                data-nav={link.id}
                onClick={() => goToSection(link.id)}
                className={cn(
                  "group flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors",
                  isHome && active === link.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="font-mono text-[0.62rem] text-primary/70">{link.num}</span>
                {link.label}
              </button>
            ))}
            <span ref={dotRef} aria-hidden="true" className="nav-dot" style={{ opacity: 0 }} />
          </div>

          <InkLink
            to="/writings"
            className={cn(
              "group flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors",
              location.pathname.startsWith("/writings")
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Feather className="h-3.5 w-3.5 text-primary/70" />
            Writings
          </InkLink>

          <div className="mx-2">
            <RegisterToggle />
          </div>

          <Button
            size="sm"
            variant="outline"
            className="ink-fill-btn border-foreground/25 font-mono text-xs"
            onClick={() => goToSection("contact")}
          >
            Let&apos;s talk
            <ArrowUpRight className="h-4 w-4" />
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
            <SheetContent side="right" className="border-foreground/10 bg-background/95 backdrop-blur-xl">
              <div className="mt-12 flex flex-col gap-2">
                {sectionLinks.map((link) => (
                  <SheetTrigger asChild key={link.id}>
                    <button
                      type="button"
                      onClick={() => goToSection(link.id)}
                      className="flex items-baseline gap-3 rounded-lg px-3 py-3 text-left font-display text-3xl font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      <span className="font-mono text-sm text-primary/70">{link.num}</span>
                      {link.label}
                    </button>
                  </SheetTrigger>
                ))}
                <SheetTrigger asChild>
                  <InkLink
                    to="/writings"
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-left font-display text-3xl font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    <Feather className="h-5 w-5 text-primary/70" />
                    Writings
                  </InkLink>
                </SheetTrigger>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    onClick={() => goToSection("contact")}
                    className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-mono text-sm font-medium text-primary-foreground"
                  >
                    Let&apos;s talk
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </SheetTrigger>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
