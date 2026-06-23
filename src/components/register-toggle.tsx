import { Code2, Feather } from "lucide-react";
import { useRegister } from "@/lib/register";
import { cn } from "@/lib/utils";

/**
 * Switches the site between the "engineer" and "poet" registers, which swaps
 * the entire theme (colors + typography) via CSS variables on <html>.
 */
export function RegisterToggle() {
  const { register, setRegister } = useRegister();

  return (
    <div
      role="radiogroup"
      aria-label="Mode"
      className="relative flex items-center rounded-full border border-border bg-card/60 p-0.5"
    >
      {/* Sliding indicator */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-0.5 h-7 w-7 rounded-full bg-primary transition-transform duration-300 ease-fluid",
          register === "poet" ? "translate-x-7" : "translate-x-0"
        )}
      />
      <button
        role="radio"
        aria-checked={register === "engineer"}
        aria-label="Engineer mode"
        title="Engineer"
        onClick={() => setRegister("engineer")}
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
        role="radio"
        aria-checked={register === "poet"}
        aria-label="Poet mode"
        title="Poet"
        onClick={() => setRegister("poet")}
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
