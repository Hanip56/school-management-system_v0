import { z } from "zod";

export const LessonSchema = z.object({
  classId: z.string().min(1, {
    message: "class is required",
  }),
  teacherId: z.string().min(1, {
    message: "teacher is required",
  }),
  subjectId: z.string().min(1, {
    message: "subject is required",
  }),
  timeDayIndex: z.string().min(1, {
    message: "Time day is required",
  }),
  timeStart: z.date({
    message: "Start time is required",
  }),
  timeEnd: z.date({
    message: "End time is required",
  }),
});
