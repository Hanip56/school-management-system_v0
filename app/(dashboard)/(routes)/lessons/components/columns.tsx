"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SetStateAction } from "react";
import CellAction from "./cell-action";

export type ColumnType = {
  id: string;
  class: string;
  teacher: string;
  subject: string;
  day: string;
  timeStart: string;
  timeEnd: string;
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
      accessorKey: "teacher",
      header: "Teacher",
    },
    {
      accessorKey: "class",
      header: "Class",
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "day",
      header: "Day",
    },
    {
      accessorKey: "timeStart",
      header: "Start Time",
    },
    {
      accessorKey: "timeEnd",
      header: "End Time",
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
