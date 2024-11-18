"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Profile",
    href: "/",
  },
  {
    label: "Classes",
    href: "classes",
  },
];

const TabsNavigation = () => {
  const pathname = usePathname();
  const prePathname = pathname.split("/").slice(0, 3).join("/");
  return (
    <div className="flex flex-col gap-1">
      {routes.map((route) => (
        <Link href={`${prePathname}/${route.href}`} key={route.href}>
          <Button
            className={cn(
              "w-fit rounded-full hover:bg-zinc-200/80",
              pathname === `${prePathname}/${route.href}` && "bg-zinc-200/80",
              route.href === "/" && pathname === prePathname && "bg-zinc-200/80"
            )}
            variant="ghost"
          >
            {route.label}
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default TabsNavigation;
