import { Teacher } from "@prisma/client";

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

export type UserShortType = {
  id: string;
  username: string;
  email: string;
};

export type TeacherWithUser = Teacher & { user: UserShortType };
