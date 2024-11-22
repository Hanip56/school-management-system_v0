"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { enUS } from "date-fns/locale";

type Props = {
  value: Date;
  onChange: (...event: any[]) => void;
};

// Date picker with years option
const DatePicker = ({ value, onChange }: Props) => {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              format(value, "PPP", { locale: enUS })
            ) : (
              <span>Select date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={value}
            locale={enUS}
            onSelect={onChange}
            fromYear={1960}
            toYear={2030}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
