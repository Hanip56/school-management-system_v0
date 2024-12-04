"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SelectWithLabel from "@/components/ui/select-with-label";
import { update } from "@/lib/fetcher/mark";
import { getStudentWithMark } from "@/lib/fetcher/student";
import { StudentWithMark } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Class, Exam, Subject } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, EditIcon, SaveIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  classes: Class[];
  exams: Exam[];
  subjects: Subject[];
};

const formSchema = z.object({
  classId: z.string().min(1, {
    message: "Class is required",
  }),
  examId: z.string().min(1, {
    message: "Exam is required",
  }),
  subjectId: z.string().min(1, {
    message: "Subject is required",
  }),
});

const ClientComp = ({ classes, subjects, exams }: Props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [students, setStudents] = useState<StudentWithMark[]>([]);
  const [markTracker, setMarkTracker] = useState<string[]>([]);
  const [currentSelectedValue, setCurrentSelectedValue] =
    useState<z.infer<typeof formSchema>>();

  // get students attendance record data mutation
  const getMutation = useMutation({
    mutationFn: ({
      examId,
      subjectId,
      classId,
    }: {
      examId: string;
      subjectId: string;
      classId: string;
    }) => getStudentWithMark({ examId, subjectId, classId }),
    onSuccess: ({ data }) => {
      setStudents(data);
      setMarkTracker(data.map((d) => d.marks?.[0]?.obtained?.toString() ?? ""));
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong.");
    },
  });

  // set/save changes mutation
  const setMutation = useMutation({
    mutationFn: () => {
      const studentsData = students.map((student, i) => ({
        id: student.id,
        mark: markTracker[i] ? parseInt(markTracker[i]) : undefined,
      }));

      return update({
        studentsData,
        classId: currentSelectedValue?.classId ?? "",
        examId: currentSelectedValue?.examId ?? "",
        subjectId: currentSelectedValue?.subjectId ?? "",
      });
    },
    onSuccess: () => {
      toast.success("Mark student saved successfully");
      setIsEdit(false);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to save.");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classId: "",
      examId: "",
      subjectId: "",
    },
  });

  // submit filtering
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await getMutation.mutateAsync(values);
    setCurrentSelectedValue(values);
  };

  const isLoading = getMutation.isPending || setMutation.isPending;

  return (
    <main>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full flex flex-wrap gap-x-4 gap-y-2 items-start">
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectWithLabel
                      label="Class"
                      value={field.value}
                      items={classes.map((v) => ({
                        label: v.name,
                        value: v.id,
                      }))}
                      onValueChange={field.onChange}
                      placeholder="Select"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="examId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectWithLabel
                      label="Exam"
                      value={field.value}
                      items={exams.map((v) => ({
                        label: v.name,
                        value: v.id,
                      }))}
                      onValueChange={field.onChange}
                      placeholder="Select"
                    />
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
                  <FormControl>
                    <SelectWithLabel
                      label="Subject"
                      value={field.value}
                      items={subjects.map((v) => ({
                        label: v.name,
                        value: v.id,
                      }))}
                      onValueChange={field.onChange}
                      placeholder="Select"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} size="sm" className="mt-[2.05rem]">
              Manage
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-6">
        {currentSelectedValue && (
          <div className="text-gray-600 text-sm font-medium mb-2">
            <div className="pt-4 pb-2">
              <div>
                <span className="w-20 inline-block">Class</span>:{" "}
                {
                  classes.find((c) => c.id === currentSelectedValue.classId)
                    ?.name
                }
              </div>
              <div>
                <span className="w-20 inline-block">Exam</span>:{" "}
                {
                  exams.find((exam) => exam.id === currentSelectedValue.examId)
                    ?.name
                }
              </div>
              <div>
                <span className="w-20 inline-block">Subject</span>:{" "}
                {
                  subjects.find(
                    (subject) => subject.id === currentSelectedValue.subjectId
                  )?.name
                }
              </div>
            </div>
            {!getMutation.isPending && students.length > 0 && (
              <div className="flex gap-4 pb-2 pt-4 border-t items-center justify-end">
                {isEdit ? (
                  <>
                    <Button
                      disabled={isLoading}
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEdit(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={isLoading}
                      size="sm"
                      onClick={() => setMutation.mutate()}
                    >
                      <SaveIcon className="size-4 mr-2" /> Save changes
                    </Button>
                  </>
                ) : (
                  <Button
                    disabled={isLoading}
                    size="sm"
                    className="bg-sky-600 hover:bg-sky-600/80"
                    onClick={() => setIsEdit(true)}
                  >
                    <EditIcon className="size-4 mr-2" /> Edit
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        <Card className="shadow-none border overflow-hidden">
          {getMutation.isPending ? (
            <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-500">
              <div className="size-10 border-2 border-gray-500 border-t-transparent animate-spin rounded-full" />
              <div>Loading...</div>
            </div>
          ) : students.length < 1 ? (
            <div className="flex flex-col items-center justify-center gap-4 p-8 text-gray-500">
              <AlertCircle />
              <div>Data not found</div>
            </div>
          ) : (
            students.length > 0 && (
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Username
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Mark obtained
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, i) => (
                      <tr key={student.id} className="bg-white border-b">
                        <td className="px-6 py-4">{student.id.slice(0, 8)}</td>
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          {student.user.username}
                        </th>

                        <td className="px-6 py-4 text-gray-900">
                          {isEdit ? (
                            <Input
                              value={markTracker[i]?.toString()}
                              disabled={isLoading}
                              type="number"
                              min={0}
                              onChange={(e) =>
                                setMarkTracker((prev) =>
                                  prev.map((v, idx) =>
                                    idx === i ? e.target.value : v
                                  )
                                )
                              }
                            />
                          ) : (
                            markTracker[i]?.toString()
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </Card>
      </div>
    </main>
  );
};

export default ClientComp;
