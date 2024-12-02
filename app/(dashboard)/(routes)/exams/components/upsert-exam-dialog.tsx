"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { ExamSchema } from "@/schemas/exam";
import { ExamWithClass } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Class } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  open: boolean;
  handleClose: () => void;
  initialData: ExamWithClass | undefined;
  classes: Class[];
};

const UpsertExamDialog = ({
  open,
  handleClose,
  initialData,
  classes,
}: Props) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof ExamSchema>>({
    resolver: zodResolver(ExamSchema),
    defaultValues: {
      name: "",
      classId: undefined,
      description: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValue("name", initialData.name);
      form.setValue("description", initialData?.description ?? undefined);
      form.setValue("classId", initialData?.classId ?? undefined);
    }
  }, [initialData, form]);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = async (values: z.infer<typeof ExamSchema>) => {
    try {
      setIsLoading(true);
      const body = {
        ...values,
      };
      const successMessage = initialData
        ? "Exam has been updated"
        : "Exam has been created";

      if (initialData) {
        // update
        await axios.put(`/api/exam/${initialData.id}`, body);
      } else {
        // create
        await axios.post(`/api/exam`, body);
      }

      toast.success(successMessage);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["exams"], exact: false });
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create exam</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="Enter exam name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="Enter exam description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classes</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(e) => field.onChange(e === "_" ? "" : e)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent className="max-h-56 overflow-y-auto">
                        <SelectItem key="all" value="_">
                          All
                        </SelectItem>
                        {classes.map((c, i) => (
                          <SelectItem key={i} value={c.id}>
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
            <div className="mt-4">
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

export default UpsertExamDialog;
