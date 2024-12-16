import { z } from "zod";

export const FeeSchema = z.object({
  classId: z.string().min(1, {
    message: "Class is required",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
  amount: z.string().min(1, {
    message: "Amount is required",
  }),
  dueDate: z.date({
    message: "Due date is required",
  }),
});
