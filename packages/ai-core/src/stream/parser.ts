import type { StreamChunk } from "./protocol.js";

export function parseStreamChunk(data: string): StreamChunk {
  return JSON.parse(data) as StreamChunk;
}
