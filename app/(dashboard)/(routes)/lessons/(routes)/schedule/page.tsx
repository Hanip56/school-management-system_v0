import prisma from "@/lib/db";
import ClientComp from "./components/client-comp";
import { getCurrentAcademicYear } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";

const SchedulePage = async ({
  searchParams,
}: {
  searchParams: { class: string; teacher: string };
}) => {
  const academicYear = await getCurrentAcademicYear();
  const teachers = await prisma.teacher.findMany({});
  const classes = await prisma.class.findMany({
    where: {
      academicYearId: academicYear?.id,
    },
  });

  const lessons = await prisma.lesson.findMany({
    where: {
      classId: searchParams?.class ?? undefined,
      teacherId: searchParams?.teacher ?? undefined,
    },
    include: {
      subject: true,
      teacher: true,
      class: true,
    },
  });

  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold my-1">Lessons - Schedule</h1>
      </header>

      <ClientComp teachers={teachers} classes={classes} lessons={lessons} />
    </div>
  );
};

export default SchedulePage;
