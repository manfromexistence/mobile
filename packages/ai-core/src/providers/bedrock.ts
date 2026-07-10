import type { AIProvider, ChatInput, ChatOutput } from "./base.js";

export class BedrockProvider implements AIProvider {
  id = "bedrock";
  name = "AWS Bedrock";

  async chat(input: ChatInput): Promise<ChatOutput> {
    return { content: "" };
  }
}
