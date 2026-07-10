import { eq } from "drizzle-orm";
import { client } from "../client.js";
import { users } from "../schema/auth.js";

export async function getUser(id: string) {
  return client.select().from(users).where(eq(users.id, id)).then((rows) => rows[0]);
}
