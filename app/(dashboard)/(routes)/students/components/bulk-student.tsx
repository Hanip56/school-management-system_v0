import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteMultiple } from "@/lib/fetcher/user";
import { deleteMultiple as unassignStudent } from "@/lib/fetcher/student-class";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SetStateAction, useState } from "react";
import { toast } from "sonner";
import { SelectedId } from "./client-comp";
import AssignModal from "./assign-modal";

type Props = {
  selectedIds: SelectedId[];
  setSelectedIds: (value: SetStateAction<SelectedId[]>) => void;
  assignedStudentIds: string[];
  unassignedStudentIds: string[];
};

const BulkStudent = ({
  selectedIds,
  setSelectedIds,
  assignedStudentIds,
  unassignedStudentIds,
}: Props) => {
  const queryClient = useQueryClient();

  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You're going to do this to all selected"
  );

  const deleteMultipleMutation = useMutation({
    mutationFn: () =>
      deleteMultiple({
        ids: selectedIds.map((sid) => sid.userId),
      }),
    onSuccess: () => {
      toast.success("Students deleted.");
      queryClient.invalidateQueries({
        queryKey: ["students"],
        exact: false,
      });
      setSelectedIds([]);
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.log(error);
    },
  });

  const unassignedMultipleMutation = useMutation({
    mutationFn: () =>
      unassignStudent({
        ids: selectedIds.map((sid) => sid.studentId),
      }),
    onSuccess: () => {
      toast.success("Students unassigned.");
      queryClient.invalidateQueries({
        queryKey: ["students"],
        exact: false,
      });
      setSelectedIds([]);
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.log(error);
    },
  });

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) {
      return;
    }

    deleteMultipleMutation.mutate();
  };

  const handleUnassigned = async () => {
    const ok = await confirm();

    if (!ok) {
      return;
    }

    unassignedMultipleMutation.mutate();
  };

  const disabled = selectedIds.length < 1;

  return (
    <>
      <ConfirmationDialog />
      <AssignModal
        open={openAssignModal}
        handleClose={() => setOpenAssignModal(false)}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={disabled}
          size="xs"
          variant="outline"
          onClick={() => setSelectedIds([])}
        >
          Unselect all
        </Button>
        <Button
          disabled={
            disabled ||
            selectedIds.some(({ studentId }) =>
              unassignedStudentIds.includes(studentId)
            )
          }
          size="xs"
          className="bg-yellow-600 hover:bg-yellow-600/80"
          onClick={handleUnassigned}
        >
          Unassigned
        </Button>
        <Button
          disabled={disabled}
          size="xs"
          className="bg-rose-600 hover:bg-rose-600/80"
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button
          disabled={
            disabled ||
            selectedIds.some(({ studentId }) =>
              assignedStudentIds.includes(studentId)
            )
          }
          size="xs"
          className="bg-emerald-600 hover:bg-emerald-600/80"
          onClick={() => setOpenAssignModal(true)}
        >
          Assign
        </Button>
      </div>
    </>
  );
};

export default BulkStudent;
