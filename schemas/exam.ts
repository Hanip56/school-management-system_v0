import { z } from "zod";

export const ExamSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z.string().optional(),
  classId: z.string().optional(),
});
