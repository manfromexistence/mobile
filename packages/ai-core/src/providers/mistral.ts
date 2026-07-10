import type { AIProvider, ChatInput, ChatOutput } from "./base.js";

export class MistralProvider implements AIProvider {
  id = "mistral";
  name = "Mistral";

  async chat(input: ChatInput): Promise<ChatOutput> {
    return { content: "" };
  }
}
