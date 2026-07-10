export function ragPrompt(context: string, query: string) {
  return `Context: ${context}\n\nQuestion: ${query}`;
}
