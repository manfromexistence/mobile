import type { AIProvider, ChatInput, ChatOutput } from "./base.js";

export class OpenAIProvider implements AIProvider {
  id = "openai";
  name = "OpenAI";

  async chat(input: ChatInput): Promise<ChatOutput> {
    return { content: "" };
  }
}
