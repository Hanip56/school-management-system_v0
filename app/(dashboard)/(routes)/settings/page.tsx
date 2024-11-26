import { Card } from "@/components/ui/card";
import SelectWithLabel from "@/components/ui/select-with-label";
import prisma from "@/lib/db";
import { format } from "date-fns";
import ClientComp from "./components/client-comp";

const SettingsPage = async () => {
  const academicYears = await prisma.academicYear.findMany({
    orderBy: {
      yearStart: "asc",
    },
  });
  const activeAcademicYear = academicYears.find((ac) => ac.active);

  return <ClientComp academicYears={academicYears} />;
};

export default SettingsPage;
