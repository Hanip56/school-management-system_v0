import { Class, Student, StudentClass, Teacher } from "@prisma/client";

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

export type UserShortType = {
  id: string;
  username: string;
  email: string;
};

export type TeacherWithUser = Teacher & { user: UserShortType };
export type StudentWithUser = Student & { user: UserShortType };
export type StudentWithUserAndClasses = Student & {
  user: UserShortType;
  classes: (StudentClass & { class: Class })[];
};
export type StudentClassWithUser = StudentClass & { student: StudentWithUser };
export type StudentClassWithUserAndClasses = StudentClass & {
  student: StudentWithUser;
  classes: Class[];
};
