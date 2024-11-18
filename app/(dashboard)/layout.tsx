import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import StateInit from "@/components/state-init";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const activeAcademicYear = await prisma.academicYear.findFirst({
    where: {
      active: true,
    },
  });

  if (!activeAcademicYear) {
    redirect("/onboarding");
  }

  return (
    <StateInit academicYear={activeAcademicYear}>
      <div>
        <Navbar />
        <Sidebar />
        <main className="w-full pt-[var(--navbar-height)] md:pt-0 md:pl-[var(--sidebar-width)]">
          {children}
        </main>
      </div>
    </StateInit>
  );
};

export default DashboardLayout;
