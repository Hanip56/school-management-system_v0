"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SetStateAction } from "react";
import CellAction from "./cell-action";

export type ColumnType = {
  id: string;
  exam: string;
  name: string;
  from: number;
  to: number;
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
      accessorKey: "exam",
      header: "Exam",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "from",
      header: "From",
    },
    {
      accessorKey: "to",
      header: "To",
    },
    {
      id: "action",
      cell: ({ row }) => (
        <CellAction
          data={row.original}
          handleOpenUpdate={(id) => setUpsertOpenId(id)}
        />
      ),
    },
  ];
};
