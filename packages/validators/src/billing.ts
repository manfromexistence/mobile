import { z } from "zod";

export const SubscribeSchema = z.object({
  planId: z.enum(["free", "pro", "team"]),
  paymentMethodId: z.string().optional(),
});
