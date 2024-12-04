"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GradeSchema } from "@/schemas/grade";
import { zodResolver } from "@hookform/resolvers/zod";
import { Exam, Grade } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  open: boolean;
  handleClose: () => void;
  initialData: Grade | undefined;
  exams: Exam[];
};

const UpsertGradeDialog = ({
  open,
  handleClose,
  initialData,
  exams,
}: Props) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof GradeSchema>>({
    resolver: zodResolver(GradeSchema),
    defaultValues: {
      name: "",
      from: "",
      to: "",
      examId: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValue("name", initialData.name);
      form.setValue("from", initialData?.fromPercentage.toString());
      form.setValue("to", initialData?.toPercentage.toString());
      form.setValue("examId", initialData?.examId);
    }
  }, [initialData, form]);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = async (values: z.infer<typeof GradeSchema>) => {
    try {
      setIsLoading(true);
      const body = {
        ...values,
        fromPercentage: +values.from,
        toPercentage: +values.to,
      };
      const successMessage = initialData
        ? "Grade has been updated"
        : "Grade has been created";

      if (initialData) {
        // update
        await axios.put(`/api/grade/${initialData.id}`, body);
      } else {
        // create
        await axios.post(`/api/grade`, body);
      }

      toast.success(successMessage);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["grades"], exact: false });
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-screen-md p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Create grade</DialogTitle>
          <DialogDescription>Fill all the required fields</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="gap-4">
            <div className="max-h-[70vh] space-y-3 overflow-y-auto p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 [&>*]:w-full gap-4">
                <FormField
                  control={form.control}
                  name="examId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exam</FormLabel>
                      <FormControl>
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select exam" />
                          </SelectTrigger>
                          <SelectContent>
                            {exams?.map((exam) => (
                              <SelectItem key={exam.id} value={exam.id}>
                                {exam.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Grade name"
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
                  name="from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From (in % without symbol)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="type number as percentage without symbol"
                          value={field.value}
                          onChange={field.onChange}
                          type="number"
                          min={0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To (in % without symbol)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="type number as percentage without symbol"
                          value={field.value}
                          onChange={field.onChange}
                          type="number"
                          min={0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="px-6 pb-6 pt-3">
              <Button className="w-full" disabled={isLoading} variant="success">
                {initialData ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertGradeDialog;
