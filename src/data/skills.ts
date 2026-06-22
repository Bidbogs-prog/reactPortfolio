export interface SkillGroup {
  label: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Frontend",
    items: ["React", "Next.js", "Angular", "TypeScript", "Tailwind CSS", "RxJS"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Nest.js", "Hono", "PostgreSQL", "Supabase", "REST", "Docker"],
  },
  {
    label: "AI & Data",
    items: [
      "LLM integration",
      "Anthropic / OpenAI APIs",
      "RAG",
      "Prompt engineering",
      "Vector search",
    ],
  },
  {
    label: "Tooling",
    items: ["Git", "Vite", "CI/CD", "Vercel", "Figma"],
  },
];
