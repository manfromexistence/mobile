export interface Model {
  id: string;
  provider: string;
  name: string;
  capabilities: string[];
}

export const modelCatalog: Model[] = [
  { id: "gpt-4o", provider: "openai", name: "GPT-4o", capabilities: ["chat", "vision"] },
  {
    id: "claude-3.5-sonnet",
    provider: "anthropic",
    name: "Claude 3.5 Sonnet",
    capabilities: ["chat", "vision"],
  },
];
