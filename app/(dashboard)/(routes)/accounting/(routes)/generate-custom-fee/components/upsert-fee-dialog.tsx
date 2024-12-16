"use client";

import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
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
import { FeeSchema } from "@/schemas/fee";
import { FeeStructureWithCategory } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Class, FeeCategory } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  open: boolean;
  handleClose: () => void;
  initialData: FeeStructureWithCategory | undefined;
  fees: FeeStructureWithCategory[];
  classes: Class[];
  categories: FeeCategory[];
};

const UpsertFeeDialog = ({
  open,
  handleClose,
  initialData,
  fees,
  classes,
  categories,
}: Props) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FeeSchema>>({
    resolver: zodResolver(FeeSchema),
    defaultValues: {
      amount: "",
      categoryId: "",
      classId: "",
      dueDate: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValue("amount", initialData?.amount.toString());
      form.setValue("categoryId", initialData?.categoryId);
      form.setValue("classId", initialData?.classId);
      // form.setValue("dueDate", initialData?);
    }
  }, [initialData, form]);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = async (values: z.infer<typeof FeeSchema>) => {
    try {
      setIsLoading(true);
      const body = {
        ...values,
        amount: parseInt(values.amount),
      };
      const successMessage = initialData
        ? "Fee has been updated"
        : "Fee has been created";

      if (initialData) {
        // update
        await axios.put(`/api/fee/${initialData.id}`, body);
      } else {
        // create
        const res = await axios.post(`/api/fee`, body);
        console.log(res);
      }

      toast.success(successMessage);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["fees"], exact: false });
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
          <DialogTitle>Create Fee</DialogTitle>
          <DialogDescription>Fill all the required fields</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="gap-4">
            <div className="max-h-[70vh] space-y-3 overflow-y-auto p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 [&>*]:w-full gap-4">
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <FormControl>
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes?.map((c) => (
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
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((c) => (
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
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Amount"
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
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
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

export default UpsertFeeDialog;
