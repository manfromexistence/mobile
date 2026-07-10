import type { AIProvider, ChatInput, ChatOutput } from "./base.js";

export class AnthropicProvider implements AIProvider {
  id = "anthropic";
  name = "Anthropic";

  async chat(input: ChatInput): Promise<ChatOutput> {
    return { content: "" };
  }
}
