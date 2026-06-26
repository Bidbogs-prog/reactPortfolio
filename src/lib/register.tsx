import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Register = "engineer" | "poet";

interface RegisterContextValue {
  register: Register;
  setRegister: (r: Register) => void;
  toggle: () => void;
}

const RegisterContext = createContext<RegisterContextValue | null>(null);

const STORAGE_KEY = "hc-register";

// Poet-only serifs aren't in the initial document; fetch them the first time
// the reader switches to poet mode so they never weigh down first paint.
const POET_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap";

function loadPoetFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById("poet-fonts")) return;
  const link = document.createElement("link");
  link.id = "poet-fonts";
  link.rel = "stylesheet";
  link.href = POET_FONTS_HREF;
  document.head.appendChild(link);
}

function getInitial(): Register {
  if (typeof window === "undefined") return "engineer";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "poet" ? "poet" : "engineer";
}

export function RegisterProvider({ children }: { children: ReactNode }) {
  const [register, setRegisterState] = useState<Register>(getInitial);

  // Reflect the active register on <html> so CSS variables can switch.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.register = register;
    window.localStorage.setItem(STORAGE_KEY, register);
    if (register === "poet") loadPoetFonts();
  }, [register]);

  const setRegister = useCallback((r: Register) => setRegisterState(r), []);
  const toggle = useCallback(
    () => setRegisterState((r) => (r === "engineer" ? "poet" : "engineer")),
    []
  );

  const value = useMemo(
    () => ({ register, setRegister, toggle }),
    [register, setRegister, toggle]
  );

  return (
    <RegisterContext.Provider value={value}>{children}</RegisterContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRegister() {
  const ctx = useContext(RegisterContext);
  if (!ctx) throw new Error("useRegister must be used within RegisterProvider");
  return ctx;
}
