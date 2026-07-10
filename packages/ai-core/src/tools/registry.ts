export class ToolRegistry {
  private tools = new Map<string, () => unknown>();

  register(name: string, handler: () => unknown) {
    this.tools.set(name, handler);
  }

  execute(name: string) {
    const handler = this.tools.get(name);
    if (!handler) throw new Error(`Tool not found: ${name}`);
    return handler();
  }
}
