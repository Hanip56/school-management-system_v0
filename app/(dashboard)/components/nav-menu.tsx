import { navigations } from "@/constants";
import Link from "next/link";
import { YearTabSidebar } from "./year-tab-sidebar";
import Logo from "@/components/logo";
import prisma from "@/lib/db";

const NavMenu = async () => {
  const academicYears = await prisma.academicYear.findMany();

  const years = academicYears.map((year) => ({
    label: `${year.yearStart.getFullYear()}/${year.yearEnd.getFullYear()}`,
    value: year.id,
    active: year.active,
  }));

  return (
    <div className="h-full w-full">
      <div className="flex flex-col items-center justify-center pb-4 border-b">
        <Logo />
        <YearTabSidebar academicYears={years} />
      </div>

      {/* some settings */}
      {/* <div className="flex flex-col border-b py-2">
        <Link
          href="#"
          className="px-3 py-2 flex items-center gap-3 hover:bg-zinc-200/80 rounded-md"
        >
          <SettingsIcon className="size-4" strokeWidth={2.5} />
          <span className="text-sm font-semibold">Settings</span>
        </Link>
      </div> */}

      {/* nav menu */}
      <div className="py-4">
        <p className="text-xs font-semibold text-zinc-400 px-3">Workspace</p>
        <div className="flex flex-col py-2">
          {navigations.map((nav) => (
            <Link
              key={nav.href}
              href={nav.href}
              className="px-3 py-2 flex items-center gap-3 hover:bg-zinc-200/80 rounded-md"
            >
              <nav.icon />
              <span className="text-sm font-medium">{nav.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
