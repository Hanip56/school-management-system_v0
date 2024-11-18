import {
  Class,
  SexType,
  Student,
  StudentClass,
  Teacher,
  User,
} from "@prisma/client";

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

export type UserWithNoPassword = Omit<User, "password">;

export type TeacherWithUser = Teacher & { user: UserWithNoPassword };
export type StudentWithUser = Student & { user: UserWithNoPassword };
export type StudentWithUserAndClasses = Student & {
  user: UserWithNoPassword;
  classes: (StudentClass & { class: Class })[];
};
export type StudentClassWithUser = StudentClass & { student: StudentWithUser };
export type StudentClassWithUserAndClasses = StudentClass & {
  student: StudentWithUser;
  classes: Class[];
};
