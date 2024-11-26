"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const TabsNav = ({ children }: Props) => {
  const pathname = usePathname();

  const routes = [
    {
      label: "General",
      href: "/settings",
    },
    {
      label: "Account",
      href: "/settings/account",
    },
  ];

  return (
    <div>
      <div className="border-b">
        <div className="px-10 flex gap-8">
          {routes.map((route) => (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                "py-4 text-sm font-medium border-b-2 border-transparent hover:font-semibold transition-all",
                route.href === pathname && "border-black font-semibold"
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </div>

      {children}
    </div>
  );
};

export default TabsNav;
