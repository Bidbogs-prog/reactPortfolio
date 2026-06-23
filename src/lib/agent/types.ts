import type { Register } from "@/lib/register";

export interface AgentResponse {
  /** The agent's reply text, in the active register's voice. */
  reply: string;
  /** Optional route (may include a #hash) to offer as a follow-up action. */
  to?: string;
  /** Human label for the action button. */
  action?: string;
}

export interface AgentContext {
  register: Register;
}

/**
 * Pluggable agent backend. The scripted backend ships today; a real
 * Claude-backed HTTP endpoint can implement this same interface later
 * (see VITE_AGENT_URL) with zero changes to the UI.
 */
export interface AgentBackend {
  ask(query: string, ctx: AgentContext): Promise<AgentResponse>;
}
