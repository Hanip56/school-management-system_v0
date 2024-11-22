import prisma from "@/lib/db";
import ClientComp from "./components/client-comp";
import { redirect } from "next/navigation";

const LessonsPage = async () => {
  const academicYear = await prisma.academicYear.findFirst({
    where: {
      active: true,
    },
  });

  if (!academicYear) {
    redirect("/onboarding");
  }

  const teachers = await prisma.teacher.findMany();
  const subjects = await prisma.subject.findMany({
    where: {
      academicYearId: academicYear.id,
    },
  });
  const classes = await prisma.class.findMany({
    where: {
      academicYearId: academicYear.id,
    },
  });

  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <p className="font-medium">✨ Lessons</p>
        <h1 className="text-3xl font-semibold my-1">List Of Lessons</h1>
      </header>

      <ClientComp teachers={teachers} subjects={subjects} classes={classes} />
    </div>
  );
};

export default LessonsPage;
