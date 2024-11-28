"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DateTimePicker } from "@/components/ui/datetime-picker";
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
import { update } from "@/lib/fetcher/attendance-record";
import { getStudentWithAttendance } from "@/lib/fetcher/student";
import { StudentWithAttendance } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AttendanceStatus, Class } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { AlertCircle, SaveIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  classes: Class[];
};

const formSchema = z.object({
  date: z.date({
    message: "Date is required",
  }),
  classId: z.string({
    message: "Class is required",
  }),
});

const ClientComp = ({ classes }: Props) => {
  const [students, setStudents] = useState<StudentWithAttendance[]>([]);
  const [statusTracker, setStatusTracker] = useState<AttendanceStatus[]>([]);
  const [currentSelectedValue, setCurrentSelectedValue] =
    useState<z.infer<typeof formSchema>>();

  // get students attendance record data mutation
  const getMutation = useMutation({
    mutationFn: ({ classId, date }: { classId: string; date: string }) =>
      getStudentWithAttendance({ classId, date }),
    onSuccess: ({ data }) => {
      setStudents(data);
      setStatusTracker(
        data.map((d) => d.attendanceRecords?.[0]?.status ?? "ABSENT")
      );
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
        status: statusTracker[i],
      }));

      return update({
        studentsData,
        classId: currentSelectedValue?.classId ?? "",
        date: currentSelectedValue?.date?.toISOString() ?? "",
      });
    },
    onSuccess: () => {
      toast.success("Attendance record saved successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to save.");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      classId: "",
    },
  });

  // submit filtering
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await getMutation.mutateAsync({
      classId: values.classId,
      date: values.date.toISOString(),
    });
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
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-500 text-xs">Date</FormLabel>
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
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-500 text-xs">Class</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent className="max-h-56 overflow-y-auto">
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
                <span className="w-20 inline-block">Date</span>:{" "}
                {format(currentSelectedValue.date, "dd MMMM yyyy")}
              </div>
              <div>
                <span className="w-20 inline-block">Class</span>:{" "}
                {
                  classes.find((c) => c.id === currentSelectedValue.classId)
                    ?.name
                }
              </div>
            </div>
            {!getMutation.isPending && students.length > 0 && (
              <div className="flex gap-4 pb-2 pt-4 border-t items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <Button
                    disabled={isLoading}
                    size="xs"
                    variant="outline"
                    onClick={() =>
                      setStatusTracker((prev) => prev.map(() => "ABSENT"))
                    }
                  >
                    Mark all absent
                  </Button>
                  <Button
                    disabled={isLoading}
                    size="xs"
                    className="bg-yellow-600 hover:bg-yellow-600/80"
                    onClick={() =>
                      setStatusTracker((prev) => prev.map(() => "LATE"))
                    }
                  >
                    Mark all Late
                  </Button>
                  <Button
                    disabled={isLoading}
                    size="xs"
                    className="bg-emerald-600 hover:bg-emerald-600/80"
                    onClick={() =>
                      setStatusTracker((prev) => prev.map(() => "PRESENT"))
                    }
                  >
                    Mark all Present
                  </Button>
                </div>
                <Button
                  disabled={isLoading}
                  size="sm"
                  onClick={() => setMutation.mutate()}
                >
                  <SaveIcon className="size-4 mr-2" /> Save changes
                </Button>
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
                        Attendance status
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
                          <Select
                            value={statusTracker[i]}
                            onValueChange={(e: AttendanceStatus) =>
                              setStatusTracker((prev) =>
                                prev.map((cur, idx) => (idx === i ? e : cur))
                              )
                            }
                          >
                            <SelectTrigger className="bg-white text-xs">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="max-h-56 overflow-y-auto">
                              <SelectItem className="text-xs" value="ABSENT">
                                ABSENT
                              </SelectItem>
                              <SelectItem className="text-xs" value="PRESENT">
                                PRESENT
                              </SelectItem>
                              <SelectItem className="text-xs" value="LATE">
                                LATE
                              </SelectItem>
                            </SelectContent>
                          </Select>
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
