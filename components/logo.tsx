import { cn } from "@/lib/utils";
import React from "react";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn(`text-2xl text-main-2 font-bold mb-5`, className)}>
      Absensi
    </div>
  );
};

export default Logo;
