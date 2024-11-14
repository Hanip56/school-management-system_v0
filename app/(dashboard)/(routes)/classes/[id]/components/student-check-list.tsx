import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { StudentWithUserAndClasses } from "@/types";
import { CheckboxIcon } from "@radix-ui/react-icons";

type Props = {
  title: string;
  students: StudentWithUserAndClasses[];
  checkedList: string[];
  setCheckedList: React.Dispatch<React.SetStateAction<string[]>>;
  disabled?: boolean;
  assigned?: boolean;
};

const StudentCheckList = ({
  title,
  students,
  checkedList,
  setCheckedList,
  disabled = false,
  assigned = false,
}: Props) => {
  return (
    <div className="py-2">
      <h6 className="text-sm font-semibold mb-2">{title}</h6>
      {students.length > 0 ? (
        students.map((student) => (
          <div
            key={student.id}
            className={cn(
              `w-full flex items-center py-4 border-t text-sm`,
              assigned && "opacity-70"
            )}
          >
            {assigned && <CheckboxIcon className="size-5 mx-4" />}
            {!assigned && (
              <Checkbox
                className="mx-4"
                checked={checkedList.includes(student.id)}
                disabled={disabled}
                onCheckedChange={(e) =>
                  setCheckedList((prev) =>
                    e
                      ? [...prev, student.id]
                      : prev.filter((p) => p !== student.id)
                  )
                }
              />
            )}
            <div>
              <h6 className="font-semibold">{student.user.username}</h6>
              <small>{student.user.email}</small>
            </div>
          </div>
        ))
      ) : (
        <div className="p-2 rounded-md bg-gray-100">
          <p className="mx-auto text-xs font-semibold text-center">
            No results.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentCheckList;
