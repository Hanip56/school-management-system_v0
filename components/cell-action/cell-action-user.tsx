"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ScanSearch, Trash } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteOne } from "@/lib/fetcher/user";
import Link from "next/link";
import { UserShortType } from "@/types";
import { UpdateIcon } from "@radix-ui/react-icons";

type CellActionProps = {
  data: UserShortType;
  roleName: string;
  handleOpenUpdate: (id: string) => void;
};

const CellActionUser: React.FC<CellActionProps> = ({
  data,
  roleName,
  handleOpenUpdate,
}) => {
  const roleNameTitleCase =
    roleName.charAt(0).toUpperCase() + roleName.slice(1);
  const roleNamePlural = roleName + "s";

  const queryClient = useQueryClient();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    `You'll delete this ${roleName}`
  );

  const deleteMutation = useMutation({
    mutationFn: deleteOne,
    onSuccess: (data) => {
      toast(`${roleNameTitleCase} has been deleted.`, {
        className: "text-emerald-600 font-semibold",
      });

      queryClient.invalidateQueries({
        queryKey: [`${roleNamePlural}`],
        exact: false,
      });
    },
    onError: (error) => {
      toast(`Failed to delete ${roleName}.`, {
        className: "text-rose-600 font-semibold",
      });
      console.log(error);
    },
  });

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    deleteMutation.mutate({ id: data.id });
  };

  return (
    <>
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link
              href={`${roleNamePlural}/${data.id}`}
              className="flex items-center"
            >
              <ScanSearch className="mr-2 size-4" /> Detail
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOpenUpdate(data.id)}>
            <UpdateIcon className="mr-2 size-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            <Trash className="mr-2 size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellActionUser;
