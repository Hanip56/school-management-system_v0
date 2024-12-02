import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { SetStateAction } from "react";
import CellAction from "./cell-action";

export type ColumnType = {
  id: string;
  name: string;
  description?: string | null;
  class?: string;
};

type Props = {
  setUpsertOpenId: (value: SetStateAction<string>) => void;
  selectedIds: string[];
  setSelectedIds: (value: SetStateAction<string[]>) => void;
};
export const columns = ({
  setUpsertOpenId,
  selectedIds,
  setSelectedIds,
}: Props): ColumnDef<ColumnType>[] => {
  return [
    // {
    //   id: "checkbox",
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={selectedIds.some((id) => id === row.original.id)}
    //       onCheckedChange={(e) =>
    //         setSelectedIds((prev) =>
    //           e
    //             ? [...prev, row.original.id]
    //             : prev.filter((id) => id !== row.original.id)
    //         )
    //       }
    //     ></Checkbox>
    //   ),
    // },
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
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "class",
      header: "Class",
      cell: ({ row }) => <div>{row.original.class ?? "All"}</div>,
    },
    {
      id: "action",
      cell: ({ row }) => (
        <CellAction data={row.original} handleOpenUpdate={setUpsertOpenId} />
      ),
    },
  ];
};
