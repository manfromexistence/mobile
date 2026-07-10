export interface AIProvider {
  id: string;
  name: string;
  chat(input: ChatInput): Promise<ChatOutput>;
}

export interface ChatInput {
  messages: { role: string; content: string }[];
  model: string;
}

export interface ChatOutput {
  content: string;
}
