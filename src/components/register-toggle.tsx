import type { MouseEvent } from "react";
import { Code2, Feather } from "lucide-react";
import { useRegister, type Register } from "@/lib/register";
import { useInkTransition } from "@/components/ink/ink-transition";
import { inkTheme, accentCss } from "@/lib/motion/ink-theme";
import { cn } from "@/lib/utils";

/**
 * Switches the site between the "engineer" and "poet" registers. The switch
 * is an ink flood: a drop of the *destination* accent grows from the toggle
 * until it covers the screen, the theme swaps underneath, and it drains.
 */
export function RegisterToggle() {
  const { register, setRegister } = useRegister();
  const { flood, isFlooding } = useInkTransition();

  const choose = (next: Register) => (e: MouseEvent<HTMLButtonElement>) => {
    if (next === register || isFlooding()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    void flood({
      color: accentCss(inkTheme(next)),
      origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      onCovered: () => setRegister(next),
      exit: next === "poet" ? "drain" : "absorb",
    });
  };

  return (
    <div
      role="radiogroup"
      aria-label="Mode"
      className="register-toggle relative flex items-center rounded-full border border-foreground/20 bg-background/60 p-0.5 backdrop-blur"
    >
      {/* The drop */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-0.5 h-7 w-7 rounded-full bg-primary transition-transform duration-500 ease-fluid",
          register === "poet" ? "translate-x-7" : "translate-x-0"
        )}
        style={{ filter: "url(#ink-seal)" }}
      />
      <button
        type="button"
        role="radio"
        aria-checked={register === "engineer"}
        aria-label="Engineer mode"
        title="Engineer"
        onClick={choose("engineer")}
        className={cn(
          "relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition-colors",
          register === "engineer"
            ? "text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Code2 className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={register === "poet"}
        aria-label="Poet mode"
        title="Poet"
        onClick={choose("poet")}
        className={cn(
          "relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition-colors",
          register === "poet"
            ? "text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Feather className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
