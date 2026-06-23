import { useEffect, useRef, useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router-dom";
import { useAgent, type AgentMessage } from "@/lib/agent/agent-provider";
import { useRegister } from "@/lib/register";
import { useTypewriter } from "@/lib/hooks/use-typewriter";
import { ArrowUpRight, CornerDownLeft, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Show me your work",
  "What have you written?",
  "I want to build something",
  "Who are you?",
];

export function CommandPalette() {
  const { open, setOpen, messages, thinking, ask } = useAgent();
  const { register } = useRegister();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, thinking]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    void ask(query);
    setQuery("");
  };

  const prompt =
    register === "poet" ? "ask, and I'll answer…" : "ask me anything…";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-background/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          className="fixed left-1/2 top-[12vh] z-[90] w-[min(92vw,640px)] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-2"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Ask the agent</Dialog.Title>

          {/* Input row */}
          <form onSubmit={submit} className="flex items-center gap-3 border-b border-border px-4 py-3.5">
            <Sparkles className="h-4 w-4 shrink-0 text-primary" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={prompt}
              className="w-full bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
            />
            <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[0.6rem] text-muted-foreground sm:inline">
              ESC
            </kbd>
          </form>

          {/* Body */}
          <div ref={scrollRef} className="max-h-[52vh] overflow-y-auto px-4 py-4">
            {messages.length === 0 && !thinking ? (
              <div>
                <p className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Try asking
                </p>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => void ask(s)}
                      className="group flex items-center justify-between rounded-lg border border-transparent px-3 py-2.5 text-left text-sm text-foreground/90 transition-colors hover:border-border hover:bg-secondary"
                    >
                      {s}
                      <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((m) =>
                  m.role === "user" ? (
                    <div key={m.id} className="flex justify-end">
                      <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-secondary px-3.5 py-2 font-mono text-sm text-foreground">
                        {m.text}
                      </p>
                    </div>
                  ) : (
                    <AgentBubble
                      key={m.id}
                      message={m}
                      onAction={(to) => {
                        setOpen(false);
                        navigate(to);
                      }}
                    />
                  )
                )}
                {thinking && <Thinking />}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border px-4 py-2.5 font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
            <span>{register === "poet" ? "the page, listening" : "agent · scripted"}</span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" /> to send
            </span>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function AgentBubble({
  message,
  onAction,
}: {
  message: AgentMessage;
  onAction: (to: string) => void;
}) {
  const { shown, done } = useTypewriter(message.text);

  return (
    <div className="flex flex-col items-start gap-2">
      <p className="max-w-[88%] text-pretty text-sm leading-relaxed text-foreground">
        {shown}
        {!done && <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-primary animate-blink" />}
      </p>
      {done && message.to && (
        <button
          onClick={() => onAction(message.to!)}
          className="flex items-center gap-1.5 rounded-full border border-primary/50 px-3 py-1.5 font-mono text-xs text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          {message.action ?? "Go"}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

function Thinking() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-primary/70"
          style={{ animation: `dotPulse 1s ${i * 0.15}s ease-in-out infinite` }}
        />
      ))}
    </div>
  );
}
