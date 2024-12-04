import prisma from "@/lib/db";
import ClientComp from "./components/client-comp";

const AttendancePage = async ({
  searchParams,
}: {
  searchParams: { classId: string; date: string };
}) => {
  const academicYear = await prisma.academicYear.findFirst({
    where: {
      active: true,
    },
  });
  const exams = await prisma.exam.findMany({
    where: {
      academicYearId: academicYear?.id,
    },
  });
  const classes = await prisma.class.findMany({
    where: {
      academicYearId: academicYear?.id,
    },
  });
  const subjects = await prisma.subject.findMany({
    where: {
      academicYearId: academicYear?.id,
    },
  });

  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold my-1">Exams - Marks</h1>
      </header>

      <ClientComp classes={classes} subjects={subjects} exams={exams} />
    </div>
  );
};

export default AttendancePage;
