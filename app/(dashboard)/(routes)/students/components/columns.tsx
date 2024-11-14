"use client";

import CellActionUser from "@/components/cell-action/cell-action-user";
import { ColumnDef } from "@tanstack/react-table";
import { SetStateAction } from "react";

export type ColumnType = {
  id: string;
  username: string;
  email: string;
  currentClass: string;
};

export const columns = (
  setUpsertOpenId: (value: SetStateAction<string>) => void
): ColumnDef<ColumnType>[] => {
  return [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "currentClass",
      header: ({ column }) => <div className="text-center">Current Class</div>,
      cell: ({ row }) => (
        <p className="text-center">{row.original.currentClass}</p>
      ),
    },
    {
      id: "action",
      cell: ({ row }) => (
        <CellActionUser
          data={row.original}
          roleName="student"
          handleOpenUpdate={(id) => setUpsertOpenId(id)}
        />
      ),
    },
  ];
};
