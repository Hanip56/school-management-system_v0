import CellActionUser from "@/components/cell-action/cell-action-user";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { SetStateAction } from "react";
import { SelectedId } from "./client-comp";

export type ColumnType = {
  userId: string;
  studentId: string;
  username: string;
  gender: string;
  phone: string;
  email: string;
  currentClass: string;
};

type Props = {
  setUpsertOpenId: (value: SetStateAction<string>) => void;
  selectedIds: SelectedId[];
  setSelectedIds: (value: SetStateAction<SelectedId[]>) => void;
};
export const columns = ({
  setUpsertOpenId,
  selectedIds,
  setSelectedIds,
}: Props): ColumnDef<ColumnType>[] => {
  return [
    {
      id: "checkbox",
      cell: ({ row }) => (
        <Checkbox
          checked={selectedIds.some(
            (sid) => sid.userId === row.original.userId
          )}
          onCheckedChange={(e) =>
            setSelectedIds((prev) =>
              e
                ? [
                    ...prev,
                    {
                      userId: row.original.userId,
                      studentId: row.original.studentId,
                    },
                  ]
                : prev.filter((v) => v.userId !== row.original.userId)
            )
          }
        ></Checkbox>
      ),
    },
    {
      accessorKey: "studentId",
      header: "Student ID",
      cell: ({ row }) => <p>{row.original.studentId.slice(0, 8)}</p>,
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => <p>{row.original.gender.substring(0, 1)}</p>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
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
          data={{
            id: row.original.userId,
            email: row.original.email,
            username: row.original.username,
          }}
          roleName="student"
          handleOpenUpdate={(id) => setUpsertOpenId(id)}
        />
      ),
    },
  ];
};
