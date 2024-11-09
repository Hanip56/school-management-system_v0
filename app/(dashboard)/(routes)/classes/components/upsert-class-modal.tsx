"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import { useAcademicYear } from "@/hooks/use-academic-year";
import { zodResolver } from "@hookform/resolvers/zod";
import { Class } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ClassSchema = z.object({
  name: z.string().min(1, {
    message: "Name field is required",
  }),
});

type Props = {
  open: boolean;
  handleClose: () => void;
  initialData?: Class;
};

const UpsertClassModal = ({ open, handleClose, initialData }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { academicYear } = useAcademicYear();
  const router = useRouter();
  const form = useForm<z.infer<typeof ClassSchema>>({
    resolver: zodResolver(ClassSchema),
    defaultValues: {
      name: initialData?.name ?? "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.setValue("name", "");
    }

    if (initialData?.name) {
      form.setValue("name", initialData.name);
    }
  }, [initialData, form, open]);

  const onSubmit = async (values: z.infer<typeof ClassSchema>) => {
    try {
      setIsLoading(true);
      const body = {
        name: values.name,
        academicYearId: academicYear?.id,
      };
      const successMessage = initialData
        ? "Class has been updated"
        : "Class has been created";

      if (initialData) {
        // update
        await axios.put(`/api/class/${initialData.id}`, body);
      } else {
        // create
        await axios.post(`/api/class`, body);
      }

      toast.success(successMessage);
      form.reset();
      router.refresh();
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Failed to create class");
    }

    setIsLoading(false);
  };

  return (
    <Modal
      title={initialData ? "Update Class" : "Create Class"}
      description="name of a class"
      isOpen={open}
      onClose={handleClose}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name={"name"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder="Enter class name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} variant="success">
            {initialData ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default UpsertClassModal;
