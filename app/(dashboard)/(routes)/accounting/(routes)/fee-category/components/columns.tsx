import { ColumnDef } from "@tanstack/react-table";
import { SetStateAction } from "react";
import CellAction from "./cell-action";

export type ColumnType = {
  id: string;
  name: string;
};

type Props = {
  setUpsertOpenId: (value: SetStateAction<string>) => void;
};
export const columns = ({
  setUpsertOpenId,
}: Props): ColumnDef<ColumnType>[] => {
  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <p>{row.original.id.slice(0, 8)}</p>,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      id: "action",
      cell: ({ row }) => (
        <CellAction data={row.original} handleOpenUpdate={setUpsertOpenId} />
      ),
    },
  ];
};
