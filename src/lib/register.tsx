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
