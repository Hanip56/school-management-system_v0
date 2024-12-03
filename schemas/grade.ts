import { z } from "zod";

export const GradeSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  from: z.string().min(1, {
    message: "From is required",
  }),
  to: z.string().min(1, {
    message: "To is required",
  }),
  examId: z.string().min(1, {
    message: "Exam is required",
  }),
});
