import { z } from "zod";

export const UIGeneratorInputSchema = z.object({
  prompt: z.string().min(1),
  framework: z.enum(["react", "nextjs"]).default("react"),
});
