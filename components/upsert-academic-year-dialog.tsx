import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DateTimePicker } from "./ui/datetime-picker";
import { Input } from "./ui/input";

type Props = {
  open: boolean;
  handleClose: () => void;
};

const formSchema = z.object({
  label: z.string().min(1, {
    message: "Label is required",
  }),
  yearStart: z.date({
    message: "Start date is required",
  }),
  yearEnd: z.date({
    message: "End date is required",
  }),
});

const UpsertAcademicYearDialog = ({ open, handleClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      yearStart: undefined,
      yearEnd: undefined,
    },
  });
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const res = await axios.post(`/api/academic-year`, values);

      toast.success("Successfully create academic year");
      form.reset();
      router.refresh();
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Failed to create academic year");
    }

    setIsLoading(false);
  };

  const disabledCondition = isLoading;

  return (
    <Dialog open={open} onOpenChange={(e) => e === false && handleClose()}>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2"
          >
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter a unique label" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      granularity="day"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearEnd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      granularity="day"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={disabledCondition}
              variant="success"
              className="mt-4"
            >
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertAcademicYearDialog;
