"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { getStudentWithAttendance } from "@/lib/fetcher/student";
import { StudentWithAttendance } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Class } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { getDaysInMonth } from "date-fns";
import { AlertCircle, SaveIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import StatusLabel from "./status-label";
import { useReactToPrint } from "react-to-print";

type Props = {
  classes: Class[];
};

const formSchema = z.object({
  month: z.string().min(1, {
    message: "Month is required",
  }),
  year: z.string().min(1, {
    message: "Year is required",
  }),
  classId: z.string().min(1, {
    message: "Class is required",
  }),
});

const ClientComp = ({ classes }: Props) => {
  const [students, setStudents] = useState<StudentWithAttendance[]>([]);
  const [currentSelectedValue, setCurrentSelectedValue] =
    useState<z.infer<typeof formSchema>>();

  const absentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: absentRef,
    pageStyle: `
    @page {
      size: landscape;  /* Set page orientation to landscape */
    }
  `,
  });

  const date = new Date();
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      month: currentMonth.toString() ?? "",
      year: currentYear.toString() ?? "",
      classId: "",
    },
  });

  // get students attendance record data
  const getMutation = useMutation({
    mutationFn: ({
      classId,
      month,
      year,
    }: {
      classId: string;
      month: string;
      year: string;
    }) => getStudentWithAttendance({ classId, month, year }),
    onSuccess: ({ data }) => {
      setStudents(data);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong.");
    },
  });

  // submit filtering
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await getMutation.mutateAsync({
      classId: values.classId,
      month: values.month,
      year: values.year,
    });
    setCurrentSelectedValue(values);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "Mei",
    "June",
    "July",
    "August",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const range = 10;
  const years = Array(range)
    .fill("")
    .map((_, i) => currentYear - range / 2 + i + "");

  const checkmarkArrayPerMonth = Array(
    currentSelectedValue
      ? getDaysInMonth(
          new Date(
            `${currentSelectedValue.year}-0${
              parseInt(currentSelectedValue.month) + 1
            }-01`
          )
        )
      : 0
  ).fill("");

  const isLoading = getMutation.isPending;

  return (
    <main>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full flex flex-wrap gap-x-4 gap-y-2 items-start">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-500 text-xs">Month</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="bg-white min-w-32">
                        <SelectValue placeholder="month" />
                      </SelectTrigger>
                      <SelectContent className="max-h-56 overflow-y-auto">
                        {months.map((month, i) => (
                          <SelectItem key={month} value={i.toString()}>
                            {month}
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
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-500 text-xs">Year</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="bg-white min-w-20">
                        <SelectValue placeholder="year" />
                      </SelectTrigger>
                      <SelectContent className="max-h-56 overflow-y-auto">
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
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
                  <FormLabel className="text-zinc-500 text-xs">Class</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="bg-white min-w-20">
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

      <div ref={absentRef} className="mt-6">
        {currentSelectedValue && (
          <div className="text-gray-600 text-sm font-medium mb-2">
            <div className="pt-4 pb-2">
              <div>
                <span className="w-28 inline-block">Month</span>:{" "}
                {`${months[parseInt(currentSelectedValue.month)]} ${
                  currentSelectedValue.year
                }`}
              </div>
              <div>
                <span className="w-28 inline-block">Class</span>:{" "}
                {
                  classes.find((c) => c.id === currentSelectedValue.classId)
                    ?.name
                }
              </div>
            </div>
            {!getMutation.isPending && students.length > 0 && (
              <div className="flex gap-4 pb-2 pt-4 border-t items-center justify-end">
                <Button
                  disabled={isLoading}
                  size="sm"
                  onClick={() => handlePrint()}
                  className="bg-sky-600 hover:bg-sky-600/80 print:hidden"
                >
                  <SaveIcon className="size-4 mr-2" /> Print
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
                <table className="w-full text-sm print:text-xs text-left text-gray-500">
                  <thead className="text-xs print:text-[0.5rem] text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Username
                      </th>

                      {checkmarkArrayPerMonth.map((_, idx) => (
                        <th scope="col" className="px-2 py-3" key={idx}>
                          {idx + 1}
                        </th>
                      ))}
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
                        {checkmarkArrayPerMonth.map((_, idx) => (
                          <td className="text-center" key={idx}>
                            <StatusLabel
                              attendanceRecords={student.attendanceRecords}
                              currentDateInNumber={idx + 1}
                            />
                          </td>
                        ))}
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
