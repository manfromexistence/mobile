import { eq } from "drizzle-orm";
import { client } from "../client.js";
import { conversations } from "../schema/chat.js";

export async function getConversations(userId: string) {
  return client.select().from(conversations).where(eq(conversations.userId, userId));
}
