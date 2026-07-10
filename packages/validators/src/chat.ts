import { z } from "zod";

export const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
});

export const ChatInputSchema = z.object({
  messages: z.array(MessageSchema),
  model: z.string(),
});
