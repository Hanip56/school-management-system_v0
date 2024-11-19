import prisma from "@/lib/db";
import { getCurrentAcademicYear } from "@/lib/server-utils";
import ClientComp from "./components/client-comp";

const SubjectsPage = async () => {
  const currentAcademicYear = await getCurrentAcademicYear();
  const subjects = await prisma.subject.findMany({
    where: {
      academicYearId: currentAcademicYear?.id,
    },
  });

  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <p className="font-medium">✨ Subjects</p>
        <h1 className="text-3xl font-semibold my-1">List Of Subjects</h1>
      </header>

      <ClientComp subjects={subjects} />
    </div>
  );
};

export default SubjectsPage;
