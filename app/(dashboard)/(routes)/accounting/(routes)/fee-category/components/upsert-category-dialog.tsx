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
import { FeeCategorySchema } from "@/schemas/fee-category";
import { zodResolver } from "@hookform/resolvers/zod";
import { FeeCategory } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  open: boolean;
  handleClose: () => void;
  initialData: FeeCategory | undefined;
};

const UpsertCategoryDialog = ({ open, handleClose, initialData }: Props) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FeeCategorySchema>>({
    resolver: zodResolver(FeeCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValue("name", initialData.name);
    }
  }, [initialData, form]);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = async (values: z.infer<typeof FeeCategorySchema>) => {
    try {
      setIsLoading(true);
      const body = {
        ...values,
      };
      const successMessage = initialData
        ? "Fee category has been updated"
        : "Fee category has been created";

      if (initialData) {
        // update
        await axios.put(`/api/fee-category/${initialData.id}`, body);
      } else {
        // create
        await axios.post(`/api/fee-category`, body);
      }

      toast.success(successMessage);
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["feeCategories"],
        exact: false,
      });
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
          <DialogTitle>Create category</DialogTitle>
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
                  <FormLabel>Fee category</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="Enter fee category name"
                    />
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

export default UpsertCategoryDialog;
