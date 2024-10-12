import { navigations } from "@/constants";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import UserTabSidebar from "./user-tab-sidebar";

const NavMenu = () => {
  return (
    <div className="h-full w-full">
      <UserTabSidebar />

      {/* some settings */}
      <div className="flex flex-col border-b pb-2">
        <Link
          href="#"
          className="px-3 py-2 flex items-center gap-3 hover:bg-zinc-200/80 rounded-md"
        >
          <SettingsIcon className="size-4" strokeWidth={2.5} />
          <span className="text-sm font-semibold">Settings</span>
        </Link>
      </div>

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
