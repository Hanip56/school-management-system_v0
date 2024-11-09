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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAcademicYear } from "@/hooks/use-academic-year";
import { generateTeacherSchema } from "@/schemas/teacher";
import { TeacherWithUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  open: boolean;
  handleClose: () => void;
  initialData: TeacherWithUser | undefined;
};

const UpsertTeacherSheet = ({ open, handleClose, initialData }: Props) => {
  const TeacherSchema = generateTeacherSchema(!!initialData);

  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const { academicYear } = useAcademicYear();
  const router = useRouter();
  const form = useForm<z.infer<typeof TeacherSchema>>({
    resolver: zodResolver(TeacherSchema),
    defaultValues: {
      username: initialData?.user?.username ?? "",
      email: initialData?.user?.email ?? "",
      password: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValue("username", initialData.user.username);
      form.setValue("email", initialData.user.email);
    }
  }, [initialData, form]);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = async (values: z.infer<typeof TeacherSchema>) => {
    try {
      setIsLoading(true);
      const body = {
        ...values,
        role: "TEACHER",
      };
      const successMessage = initialData
        ? "Teacher has been updated"
        : "Teacher has been created";

      if (initialData) {
        // update
        await axios.put(`/api/teachers/${initialData.user.id}`, {
          user: body,
        });
      } else {
        // create
        await axios.post(`/api/auth/register`, body);
      }

      toast.success(successMessage);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["teachers"], exact: false });
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };

  return (
    <Sheet open={open} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent side={"right"}>
        <SheetHeader>
          <SheetTitle>Create teacher</SheetTitle>
          <SheetDescription>create user as a teacher</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-5"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="Enter teacher username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="Enter teacher email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!initialData && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        type="password"
                        placeholder="Enter password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button disabled={isLoading} variant="success">
              {initialData ? "Update" : "Create"}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default UpsertTeacherSheet;
