import { weekdays } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props = {
  onChange: (...event: any[]) => void;
  value: string;
  disabled?: boolean;
};

const SelectWeekdays = ({ onChange, disabled, value }: Props) => {
  return (
    <Select onValueChange={onChange} disabled={disabled} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Weekday" />
      </SelectTrigger>
      <SelectContent>
        {weekdays.map((day, i) => (
          <SelectItem key={day} value={i.toString()}>
            {day}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectWeekdays;
