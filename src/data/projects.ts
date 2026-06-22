export interface Project {
  id: string;
  title: string;
  year: string;
  description: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
  /** Optional highlight shown as a one-line outcome. */
  highlight?: string;
}

export const projects: Project[] = [
  {
    id: "pieces-maroc",
    title: "PiecesMaroc",
    year: "2026",
    description:
      "A car-parts marketplace for Morocco, search components by vehicle (make → model → engine), browse a 30k+ catalog, manage a cart, and check out over WhatsApp.",
    highlight: "32k vehicles, 9k parts, WhatsApp checkout",
    tags: ["Next.js", "React", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS"],
    demoUrl: "https://piecesmaroc.vercel.app",
    githubUrl: "https://github.com/Bidbogs-prog/piecesmaroc",
  },
  {
    id: "expensio",
    title: "Expensio",
    year: "2024",
    description:
      "An expense tracker that logs income sources, expenses, and balance, then surfaces tailored financial recommendations from your spending patterns.",
    highlight: "Personalized insights from spending data",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    demoUrl: "https://expensio-tau.vercel.app",
    githubUrl: "https://github.com/Bidbogs-prog/expensio",
  },
  {
    id: "clanker-support",
    title: "Clanker Support",
    year: "2026",
    description:
      "An AI-powered customer-support platform: an embeddable chat widget backed by an admin dashboard, built on an LLM gateway for intelligent, self-serve support.",
    highlight: "Embeddable AI support widget + admin dashboard",
    tags: ["Next.js", "TypeScript", "Hono", "Drizzle ORM", "LLM Gateway", "Stripe"],
    demoUrl: "https://clankersupport.com",
    githubUrl: "https://github.com/theopenco/llmchat",
  },
];
