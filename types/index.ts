import {
  AttendanceRecord,
  Class,
  Exam,
  FeeCategory,
  FeeStructure,
  Grade,
  Lesson,
  Mark,
  Student,
  StudentClass,
  Subject,
  Teacher,
  User,
} from "@prisma/client";

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

export type UserShortType = {
  id: string;
  username: string;
  email: string;
};
export type UserWithNoPassword = Omit<User, "password">;

export type TeacherWithUser = Teacher & { user: UserWithNoPassword };

//=============== students type
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
export type StudentWithAttendance = {
  id: string;
  user: { id: string; username: string };
  attendanceRecords: AttendanceRecord[];
};
export type StudentWithMark = {
  id: string;
  user: { id: string; username: string };
  marks: (Mark & { subject: Subject })[];
};
//===============

export type LessonFull = Omit<Lesson, "timeStart timeEnd"> & {
  teacher: Teacher;
  class: Class;
  subject: Subject;
  // change to string for fetching in the client
  timeStart: string;
  timeEnd: string;
};
export type ExamWithClass = Exam & {
  class: Class;
};
export type GradeWithExam = Grade & { exam: Exam };
export type FeeStructureWithCategory = FeeStructure & { category: FeeCategory };
