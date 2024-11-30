import { AttendanceRecord } from "@prisma/client";
import { getDate } from "date-fns";

type Props = {
  attendanceRecords: AttendanceRecord[];
  currentDateInNumber: number;
};

const StatusLabel = ({ attendanceRecords, currentDateInNumber }: Props) => {
  const status = attendanceRecords.find(
    (record) => getDate(record.date) === currentDateInNumber
  )?.status;

  if (!status) return <div className="size-4 rounded-full bg-gray-100" />;

  return (
    <div className="text-[0.5rem] font-semibold text-white">
      {status === "ABSENT" && (
        <div className="size-4 rounded-full bg-red-600">A</div>
      )}
      {status === "PRESENT" && (
        <div className="size-4 rounded-full bg-emerald-600">P</div>
      )}
      {status === "LATE" && (
        <div className="size-4 rounded-full bg-yellow-600">L</div>
      )}
    </div>
  );
};

export default StatusLabel;
