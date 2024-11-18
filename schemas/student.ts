import { z } from "zod";
import { genderEnum } from ".";

export const generateStudentSchema = (withNoPassword = false) => {
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
    firstName: z.string().min(1, {
      message: "First Name is required",
    }),
    lastName: z.string().optional(),
    phone: z.string().min(1, {
      message: "Phone is required",
    }),
    address: z.string().min(1, {
      message: "Address is required",
    }),
    birthday: z.date({
      message: "Birthday is required",
    }),
    sex: z.enum(genderEnum, {
      message: "Sex field is required",
    }),
  });
};
