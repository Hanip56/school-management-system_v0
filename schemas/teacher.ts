import { z } from "zod";

export const generateTeacherSchema = (withNoPassword = false) => {
  return z.object({
    username: z.string().min(3, {
      message: "Name field is required",
    }),
    email: z.string().email({
      message: "Email is not valid",
    }),
    password: withNoPassword
      ? z.string().optional()
      : z.string().min(6, {
          message: "Minimum password is 6 characters",
        }),
  });
};
