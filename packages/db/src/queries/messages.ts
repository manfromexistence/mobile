import { eq } from "drizzle-orm";
import { client } from "../client.js";
import { messages } from "../schema/chat.js";

export async function getMessages(conversationId: string) {
  return client.select().from(messages).where(eq(messages.conversationId, conversationId));
}
