import type { StreamChunk } from "./protocol.js";

export function writeStreamChunk(chunk: StreamChunk): string {
  return JSON.stringify(chunk) + "\n";
}
