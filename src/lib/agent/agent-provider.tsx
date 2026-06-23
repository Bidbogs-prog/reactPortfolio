import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRegister } from "@/lib/register";
import { scriptedBackend } from "./scripted-backend";
import type { AgentBackend } from "./types";

export interface AgentMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  to?: string;
  action?: string;
}

interface AgentContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  openPalette: () => void;
  messages: AgentMessage[];
  thinking: boolean;
  ask: (query: string) => Promise<void>;
  reset: () => void;
}

const Ctx = createContext<AgentContextValue | null>(null);

// Adapter seam: swap to an HTTP/Claude backend when VITE_AGENT_URL is set.
const backend: AgentBackend = scriptedBackend;

let idCounter = 0;
const nextId = () => `m${++idCounter}`;

export function AgentProvider({ children }: { children: ReactNode }) {
  const { register } = useRegister();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const registerRef = useRef(register);
  registerRef.current = register;

  const openPalette = useCallback(() => setOpen(true), []);
  const reset = useCallback(() => setMessages([]), []);

  const ask = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setMessages((m) => [...m, { id: nextId(), role: "user", text: trimmed }]);
    setThinking(true);
    try {
      const res = await backend.ask(trimmed, { register: registerRef.current });
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          role: "agent",
          text: res.reply,
          to: res.to,
          action: res.action,
        },
      ]);
    } finally {
      setThinking(false);
    }
  }, []);

  // Global ⌘K / Ctrl+K to summon the agent.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(
    () => ({ open, setOpen, openPalette, messages, thinking, ask, reset }),
    [open, openPalette, messages, thinking, ask, reset]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAgent() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAgent must be used within AgentProvider");
  return ctx;
}
