import prisma from "@/lib/db";
import { getCurrentAcademicYear } from "@/lib/server-utils";
import { notFound } from "next/navigation";
import ClientComp from "./components/client-comp";
import BreadcrumbNav from "@/components/breadcrumb-nav";
// import ClientComp from "./components/client-comp";

const ClassesPage = async ({ params }: { params: { id: string } }) => {
  const currentAcademicYear = await getCurrentAcademicYear();
  const currentClass = await prisma.class.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!currentClass) return notFound();

  return (
    <div className="container-dashboard">
      <header className="mb-6">
        {/* <p className="font-medium">✨ Detail Class</p> */}
        <h1 className="text-3xl font-semibold my-1">
          Class {currentClass.name}
        </h1>
        <BreadcrumbNav />
      </header>

      <ClientComp />
    </div>
  );
};

export default ClassesPage;
