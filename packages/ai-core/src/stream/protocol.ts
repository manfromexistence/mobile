export type StreamChunk = {
  type: "text" | "tool_call" | "tool_result" | "error";
  content: string;
};
