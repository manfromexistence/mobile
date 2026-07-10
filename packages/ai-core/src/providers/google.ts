import type { AIProvider, ChatInput, ChatOutput } from "./base.js";

export class GoogleProvider implements AIProvider {
  id = "google";
  name = "Google";

  async chat(input: ChatInput): Promise<ChatOutput> {
    return { content: "" };
  }
}
