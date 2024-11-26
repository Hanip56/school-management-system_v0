import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteMultiple } from "@/lib/fetcher/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SetStateAction } from "react";
import { toast } from "sonner";

type Props = {
  selectedIds: string[];
  setSelectedIds: (value: SetStateAction<string[]>) => void;
};

const BulkStudentButtons = ({ selectedIds, setSelectedIds }: Props) => {
  const queryClient = useQueryClient();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You're going to delete all selected students"
  );

  const deleteMutation = useMutation({
    mutationFn: () =>
      deleteMultiple({
        ids: selectedIds,
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

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) {
      return;
    }

    // TODO: DELETE ALL REQUESTS
    deleteMutation.mutate();
  };

  const disabled = selectedIds.length < 1;

  return (
    <>
      <ConfirmationDialog />
      <div className="flex gap-2">
        <Button
          disabled={disabled}
          size="xs"
          variant="outline"
          onClick={() => setSelectedIds([])}
        >
          Unselect all
        </Button>
        <Button
          disabled={disabled}
          size="xs"
          className="bg-yellow-600 hover:bg-yellow-600/80"
        >
          Deactivate
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
          disabled={disabled}
          size="xs"
          className="bg-emerald-600 hover:bg-emerald-600/80"
        >
          Assign
        </Button>
      </div>
    </>
  );
};

export default BulkStudentButtons;
