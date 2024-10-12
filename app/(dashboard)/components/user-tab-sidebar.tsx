import { ChevronsUpDown, UserIcon } from "lucide-react";
import React from "react";

const UserTabSidebar = () => {
  return (
    <div className="flex gap-3 p-3 items-center rounded-md hover:bg-zinc-200/80 transition-all cursor-pointer">
      <div className="size-9 flex items-center justify-center text-white bg-sky-700 rounded-md flex-shrink-0">
        <UserIcon className="size-5" />
      </div>
      <div className="flex flex-col justify-center flex-1">
        <p className="leading-5 font-semibold">Halfz</p>
        <small className="leading-4 text-xs">Admin</small>
      </div>

      <ChevronsUpDown className="size-4" />
    </div>
  );
};

export default UserTabSidebar;
