import prisma from "@/lib/db";
import { getCurrentAcademicYear } from "@/lib/server-utils";
import ClientComp from "./components/client-comp";

const ClassesPage = async () => {
  const currentAcademicYear = await getCurrentAcademicYear();
  const classes = await prisma.class.findMany({
    where: {
      academicYearId: currentAcademicYear?.id,
    },
  });

  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <p className="font-medium">✨ Classes</p>
        <h1 className="text-3xl font-semibold my-1">List Of Classes</h1>
      </header>

      <ClientComp classes={classes} />
    </div>
  );
};

export default ClassesPage;
