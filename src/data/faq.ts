export interface Faq {
  q: string;
  a: string;
}

/**
 * Plain-language Q&A written to be extractable by answer engines (ChatGPT,
 * Perplexity, Google AI Overviews). Each answer is self-contained, factual,
 * and specific. Also emitted as FAQPage JSON-LD on the home page.
 */
export const faq: Faq[] = [
  {
    q: "Who is Haytham Chhilif?",
    a: "Haytham Chhilif is a self-taught full-stack and AI engineer based in Morocco. He builds fast, thoughtful web applications with React, Next.js, Node, and modern AI tooling, and also writes essays, poetry, and short fiction.",
  },
  {
    q: "What does Haytham Chhilif do?",
    a: "He designs and ships full-stack web products end to end — from interfaces to APIs and databases — and integrates AI such as LLMs, retrieval-augmented generation, and support agents into them. He also edits English-language fiction for the cultural NGO The Olive Writers.",
  },
  {
    q: "What technologies and skills does Haytham use?",
    a: "Front end: React, Next.js, Angular, and TypeScript. Back end: Node.js, Nest.js, Hono, PostgreSQL, and Supabase. AI: LLM integration, RAG, prompt engineering, and vector search. Tooling: Git, Vite, Docker, and Vercel.",
  },
  {
    q: "What has Haytham built?",
    a: "Selected projects include PiecesMaroc, a car-parts marketplace for Morocco; Expensio, an expense tracker with tailored financial insights; and Clanker Support, an AI customer-support platform with an embeddable chat widget.",
  },
  {
    q: "Is Haytham Chhilif available for freelance or full-time work?",
    a: "Yes. Haytham takes on full-stack and AI-focused projects and is open to remote roles worldwide. The fastest way to reach him is by email at haythamchhilif@gmail.com.",
  },
  {
    q: "Where is Haytham Chhilif based?",
    a: "Haytham is based in Morocco and available for remote work worldwide.",
  },
];
