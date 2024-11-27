import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SelectedId } from "./client-comp";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAll } from "@/lib/fetcher/class";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createMultiple } from "@/lib/fetcher/student-class";
import { toast } from "sonner";
import { useAcademicYear } from "@/hooks/use-academic-year";
import { SetStateAction } from "react";

type Props = {
  open: boolean;
  handleClose: () => void;
  selectedIds: SelectedId[];
  setSelectedIds: (value: SetStateAction<SelectedId[]>) => void;
};

const formSchema = z.object({
  classId: z.string().min(1, {
    message: "Class is required",
  }),
});

const AssignModal = ({
  open,
  handleClose,
  selectedIds,
  setSelectedIds,
}: Props) => {
  const queryClient = useQueryClient();
  const { academicYear } = useAcademicYear();
  const query = useQuery({
    queryKey: ["classes"],
    queryFn: () => getAll({}),
  });

  const classes = query?.data?.data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classId: "",
    },
  });

  const assignMultipleMutation = useMutation({
    mutationFn: (classId: string) =>
      createMultiple({
        studentIds: selectedIds.map((sid) => sid.studentId),
        academicYearId: academicYear?.id ?? "",
        classId,
      }),
    onSuccess: () => {
      toast.success("Students assigned.");
      queryClient.invalidateQueries({
        queryKey: ["students"],
        exact: false,
      });
      setSelectedIds([]);
      handleClose();
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.log(error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    assignMultipleMutation.mutate(values.classId);
  };

  const disabled =
    query.isLoading || query.isPending || assignMultipleMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(e) => !e && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign student</DialogTitle>
          <DialogDescription>Assign student to a class</DialogDescription>
        </DialogHeader>

        {(query?.isLoading || query?.isPending) && (
          <div className="h-20 flex items-center justify-center text-center w-full">
            Loading...
          </div>
        )}
        {query?.isError && (
          <div className="h-20 flex items-center justify-center text-center w-full">
            Failed to get classes...
          </div>
        )}
        {query?.data && query?.data?.data.length < 1 ? (
          <div className="h-20 flex flex-col gap-2 items-center justify-center text-center w-full">
            <p className="text-gray-500 text-sm">
              You have to create class first
            </p>
            <Link href="/classes">
              <Button className="w-full">
                Go to classes <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {classes && (
                <FormField
                  control={form.control}
                  disabled={disabled}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button
                disabled={disabled}
                className="mt-4 w-full"
                variant="success"
              >
                Assign
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssignModal;
