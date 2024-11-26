"use client";

import CalendarFull from "@/components/calendar-full";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import usePushQuery from "@/hooks/use-push-query";
import { LessonFull } from "@/types";
import { Class, Lesson, Subject, Teacher } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import qs from "query-string";

type Props = {
  classes: Class[];
  teachers: Teacher[];
  lessons: (Lesson & { teacher: Teacher; class: Class; subject: Subject })[];
};

const ClientComp = ({ classes, teachers, lessons }: Props) => {
  const params = qs.parse(useSearchParams().toString());
  const pushQuery = usePushQuery();
  const classParam = (params?.class as string) ?? "";
  const teacherParam = (params?.teacher as string) ?? "";

  return (
    <div>
      {/* filter */}
      <div className="w-full flex flex-wrap gap-x-4 gap-y-2 items-center mb-6">
        <div className="min-w-32 space-y-1">
          <Label className="text-zinc-500 text-xs">Class</Label>
          <Select
            value={classParam}
            onValueChange={(e) => pushQuery({ class: e === "_" ? "" : e })}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all" value="_">
                All
              </SelectItem>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-32 space-y-1">
          <Label className="text-zinc-500 text-xs">Teachers</Label>
          <Select
            value={teacherParam}
            onValueChange={(e) => pushQuery({ teacher: e === "_" ? "" : e })}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all" value="_">
                All
              </SelectItem>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.firstName + "" + teacher.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* <div className="w-fit space-y-1">
            <Label className="text-zinc-500 text-xs">Exports</Label>
            <ExportButtons data={dataTable} />
          </div> */}
      </div>

      <div className="p-4 bg-white rounded-md border h-[44rem] overflow-hidden">
        <CalendarFull lessons={lessons} />
      </div>
    </div>
  );
};

export default ClientComp;
