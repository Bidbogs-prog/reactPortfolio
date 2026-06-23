import type { Register } from "@/lib/register";
import type { AgentBackend, AgentContext, AgentResponse } from "./types";

interface Intent {
  test: RegExp;
  to?: string;
  action?: string;
  reply: Record<Register, string>;
}

// Evaluated top to bottom; first match wins, so order from specific to general.
const INTENTS: Intent[] = [
  {
    test: /\b(writ|blog|article|read|poem|poetry|verse|prose|story|stories|essay|words)\b/i,
    to: "/writings",
    action: "Open writings",
    reply: {
      engineer:
        "I keep notes on what I learn building software — plus the odd poem. Opening the writings.",
      poet: "Two streams from one desk: code and verse. Step into the writings.",
    },
  },
  {
    test: /\b(ai|a\.i\.|llm|agent|model|gpt|claude|machine learning|ml|rag)\b/i,
    to: "/#work",
    action: "See the AI work",
    reply: {
      engineer:
        "AI is my focus lately — support agents and LLM-backed features that stay out of the way. Clanker Support is the flagship.",
      poet: "Lately I teach machines to be useful, and quiet. Clanker Support is the proof of it.",
    },
  },
  {
    test: /\b(hire|freelance|available|build me|build something|need a|looking for|collaborat|work with|project for|quote|budget)\b/i,
    to: "/#contact",
    action: "Start a project",
    reply: {
      engineer:
        "Yes — I take on full-stack and AI builds. Tell me what you're making and I'll come back fast.",
      poet: "If you've an idea worth building, I'm listening. Let's talk it into being.",
    },
  },
  {
    test: /\b(contact|reach|email|message|get in touch|talk|connect)\b/i,
    to: "/#contact",
    action: "Reach me",
    reply: {
      engineer: "Easiest is email — haythamchhilif@gmail.com — or the form at the bottom.",
      poet: "Find me at haythamchhilif@gmail.com, or leave a note below.",
    },
  },
  {
    test: /\b(work|projects?|portfolio|built|building|made|ship|shipped|demo)\b/i,
    to: "/#work",
    action: "See the work",
    reply: {
      engineer:
        "Three things I've shipped — a car-parts marketplace, an expense tracker, and an AI support platform. Scrolling you there.",
      poet: "Come see what these hands have made. Three finished things — this way.",
    },
  },
  {
    test: /\b(stack|skills?|tech|tools?|languages?|frameworks?|know)\b/i,
    to: "/#about",
    action: "See the stack",
    reply: {
      engineer:
        "React, Next.js, Node/Nest, Hono, Postgres, and LLM tooling. The full list lives in About.",
      poet: "The tools of the trade — React, Next, Node, and a little machine intelligence. They're in About.",
    },
  },
  {
    test: /\b(who|about|yourself|background|story|haytham)\b/i,
    to: "/#about",
    action: "About me",
    reply: {
      engineer:
        "Self-taught full-stack + AI developer from Morocco, five years of shipping. Here's the longer version.",
      poet: "I'm Haytham — I build by day and write by night. Here's a little more of the story.",
    },
  },
  {
    test: /\b(hi|hey|hello|yo|sup|salut|hola|greetings)\b/i,
    reply: {
      engineer:
        "Hey. Ask me to show you the work, the writings, or how to start a project.",
      poet: "Hello, traveler. Ask for the work, the words, or a way to reach me.",
    },
  },
];

const FALLBACK: Record<Register, string> = {
  engineer:
    "Not sure I caught that. Try: “show me your work”, “what have you written”, or “I want to build something”.",
  poet: "I didn't quite follow. Try asking for the work, the writings, or a way to reach me.",
};

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const scriptedBackend: AgentBackend = {
  async ask(query: string, { register }: AgentContext): Promise<AgentResponse> {
    // A touch of latency so it reads as "thinking", not a lookup.
    await delay(360 + Math.random() * 320);

    const intent = INTENTS.find((i) => i.test.test(query));
    if (intent) {
      return { reply: intent.reply[register], to: intent.to, action: intent.action };
    }
    return { reply: FALLBACK[register] };
  },
};
