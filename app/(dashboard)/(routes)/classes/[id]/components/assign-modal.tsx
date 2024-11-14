import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAcademicYear } from "@/hooks/use-academic-year";
import { useDebounce } from "@/hooks/use-debounce";
import { getAll } from "@/lib/fetcher/student";
import { create } from "@/lib/fetcher/student-class";
import { StudentWithUserAndClasses } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import StudentCheckList from "./student-check-list";

const AssignModal = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { academicYear } = useAcademicYear();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const debouncedSearch = useDebounce(search);

  const query = useQuery({
    queryKey: ["search-student", { search: debouncedSearch }],
    queryFn: () =>
      getAll({
        search: debouncedSearch,
      }),
  });

  const isLoading = query.isLoading || query.isPending;
  const isError = query.isError;

  const students = query?.data?.data ?? [];

  const assignedStudents: StudentWithUserAndClasses[] = [];
  const notAssignedStudents: StudentWithUserAndClasses[] = [];

  students.forEach((student) => {
    if (student.classes.find((c) => c.academicYearId === academicYear?.id)) {
      assignedStudents.push(student);
    } else {
      notAssignedStudents.push(student);
    }
  });

  // TODO: check is student assigned or not by check is it belong to a class in this current academic year

  const mutation = useMutation({
    mutationFn: () =>
      create({
        academicYearId: academicYear?.id ?? "",
        classId: (params.id as string) ?? "",
        studentIds: checkedList,
      }),
    onSuccess: () => {
      toast.success("Students assigned.");
      queryClient.invalidateQueries({
        queryKey: ["class", params.id],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["search-student"],
        exact: false,
      });
      setCheckedList([]);
      setOpen(false);
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.log(error);
    },
  });

  return (
    <Dialog open={open} onOpenChange={(open) => !open && setOpen(false)}>
      <DialogTrigger asChild>
        <Button variant="success" onClick={() => setOpen(true)}>
          <PlusIcon className="size-5 mr-2" />{" "}
          <span className="line-clamp-1">Assign student</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[50rem]">
        <DialogHeader>
          <DialogTitle>Assign Student</DialogTitle>
          {/* search */}
        </DialogHeader>
        <div>
          <div className="flex items-center relative">
            <SearchIcon className="size-5 mr-3 absolute left-4 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student"
              className="w-full indent-10"
            />
          </div>
          <div className="mt-6 max-h-96 overflow-auto">
            {!isError && !isLoading && (
              <>
                <StudentCheckList
                  title="Not Assigned"
                  checkedList={checkedList}
                  setCheckedList={setCheckedList}
                  students={notAssignedStudents}
                />
                <StudentCheckList
                  title="Assigned"
                  checkedList={checkedList}
                  setCheckedList={setCheckedList}
                  students={assignedStudents}
                  assigned={true}
                />
              </>
            )}
            {isError && <p>Error!</p>}
            {isLoading && <p>Loading...</p>}
          </div>
        </div>
        <DialogFooter>
          <Button
            className="w-full"
            variant="success"
            disabled={checkedList.length < 1 || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignModal;
