import prisma from "@/lib/db";
import ClientComp from "./components/client-comp";

const StudentsPage = async () => {
  const academicYear = await prisma.academicYear.findFirst({
    where: {
      active: true,
    },
  });
  const classes = await prisma.class.findMany({
    where: {
      academicYearId: academicYear?.id,
    },
  });
  const feeCategories = await prisma.feeCategory.findMany();

  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold my-1">
          Accounting - Generate custom fee
        </h1>
      </header>

      <ClientComp classes={classes} feeCategories={feeCategories} />
    </div>
  );
};

export default StudentsPage;
