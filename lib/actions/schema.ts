import { z } from "zod";
export const insertResourceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
});

export type NewResourceParams = z.infer<typeof insertResourceSchema>;