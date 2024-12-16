import { z } from "zod";

export const FeeCategorySchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
});
