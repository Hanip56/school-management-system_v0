"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SetStateAction } from "react";
import CellAction from "./cell-action";

export type ColumnType = {
  id: string;
  category: string;
  amount: string;
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
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "amount",
      header: "Amount",
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