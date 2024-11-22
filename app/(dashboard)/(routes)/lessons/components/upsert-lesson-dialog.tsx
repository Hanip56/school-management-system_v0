"use client";

import SelectWeekdays from "@/components/select-weekdays";
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/ui/datetime-picker";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAcademicYear } from "@/hooks/use-academic-year";
import { generateDateBaseOnWeekday } from "@/lib/utils";
import { LessonSchema } from "@/schemas/lesson";
import { LessonFull } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Class, Subject, Teacher } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getDay } from "date-fns";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  open: boolean;
  handleClose: () => void;
  initialData: LessonFull | undefined;
  classes: Class[];
  teachers: Teacher[];
  subjects: Subject[];
};

const UpsertLessonDialog = ({
  open,
  handleClose,
  initialData,
  classes,
  teachers,
  subjects,
}: Props) => {
  const queryClient = useQueryClient();
  const { academicYear } = useAcademicYear();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof LessonSchema>>({
    resolver: zodResolver(LessonSchema),
    defaultValues: {
      classId: "",
      subjectId: "",
      teacherId: "",
      timeDayIndex: "",
      timeEnd: undefined,
      timeStart: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.setValue("classId", initialData.classId);
      form.setValue("subjectId", initialData.subjectId);
      form.setValue("teacherId", initialData.teacherId);
      form.setValue("timeDayIndex", getDay(initialData.timeStart).toString());
      form.setValue("timeStart", new Date(initialData.timeStart));
      form.setValue("timeEnd", new Date(initialData.timeEnd));
    }
  }, [initialData, form]);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = async (values: z.infer<typeof LessonSchema>) => {
    try {
      setIsLoading(true);
      const body = {
        ...values,
        timeStart: generateDateBaseOnWeekday(
          values.timeDayIndex,
          values.timeStart
        ),
        timeEnd: generateDateBaseOnWeekday(values.timeDayIndex, values.timeEnd),
        academicYearId: academicYear?.id,
      };
      const successMessage = initialData
        ? "Lesson has been updated"
        : "Lesson has been created";

      if (initialData) {
        // update
        await axios.put(`/api/lesson/${initialData.id}`, body);
      } else {
        // create
        await axios.post(`/api/lesson`, body);
      }

      toast.success(successMessage);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["lessons"], exact: false });
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
          <DialogTitle>Create lesson</DialogTitle>
          <DialogDescription>Fill all the required fields</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="gap-4">
            <div className="max-h-[70vh] space-y-3 overflow-y-auto p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 [&>*]:w-full gap-4">
                <FormField
                  control={form.control}
                  name="teacherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teacher</FormLabel>
                      <FormControl>
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            {teachers?.map((teacher) => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {`${teacher.firstName} ${teacher?.lastName}`}
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
                            {classes?.map((classs) => (
                              <SelectItem key={classs.id} value={classs.id}>
                                {classs.name}
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
                  name="subjectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects?.map((subject) => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 [&>*]:w-full gap-4">
                <FormField
                  control={form.control}
                  name="timeDayIndex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day</FormLabel>
                      <FormControl>
                        <SelectWeekdays
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
                  name="timeStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <div className="flex justify-start">
                          <TimePicker
                            date={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <div className="flex justify-start">
                          <TimePicker
                            date={field.value}
                            onChange={field.onChange}
                          />
                        </div>
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

export default UpsertLessonDialog;
