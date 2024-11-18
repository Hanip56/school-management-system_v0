"use client";

import { navigations } from "@/constants";
import Link from "next/link";
import { YearTabSidebar } from "./year-tab-sidebar";
import Logo from "@/components/logo";
import prisma from "@/lib/db";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NavMenu = () => {
  const pathname = usePathname();

  const shortPathname = pathname.split("/").slice(0, 2).join("/");

  // const academicYears = await prisma.academicYear.findMany();

  // const years = academicYears.map((year) => ({
  //   label: `${year.yearStart.getFullYear()}/${year.yearEnd.getFullYear()}`,
  //   value: year.id,
  //   active: year.active,
  // }));

  return (
    <div className="h-full w-full">
      <div className="flex flex-col items-center justify-center pb-2 border-b">
        <Logo />
        {/* <YearTabSidebar academicYears={years} /> */}
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
      <div className="py-2">
        <div className="flex flex-col py-2  gap-px h-[87vh] overflow-y-auto px-4">
          {navigations.map((nav, i) =>
            nav.href ? (
              <Link
                key={nav.href}
                href={nav.href}
                className={cn(
                  "px-3 py-2 flex items-center gap-3 hover:bg-zinc-200/50 rounded-md",
                  nav.href === shortPathname && "bg-zinc-200/80"
                )}
              >
                {nav.icon && <nav.icon />}
                <span className="text-sm font-medium">{nav.label}</span>
              </Link>
            ) : (
              <div
                key={i}
                className="text-xs font-semibold text-zinc-400 px-3 py-2"
              >
                {nav.subtitle ?? ""}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
