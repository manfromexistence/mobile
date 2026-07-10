import type { AIProvider, ChatInput, ChatOutput } from "./base.js";

export class GroqProvider implements AIProvider {
  id = "groq";
  name = "Groq";

  async chat(input: ChatInput): Promise<ChatOutput> {
    return { content: "" };
  }
}
