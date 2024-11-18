import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Props = {
  onChange: (...event: any[]) => void;
  value: "MALE" | "FEMALE";
  disabled?: boolean;
};

const SelectGender = ({ onChange, disabled, value }: Props) => {
  return (
    <Select onValueChange={onChange} disabled={disabled} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select gender" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="MALE">Male</SelectItem>
        <SelectItem value="FEMALE">Female</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectGender;
