"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAcademicYear } from "@/hooks/use-academic-year";

type AcademicYearMap = {
  label: string;
  value: string;
  active: boolean;
};

type Props = {
  academicYears: AcademicYearMap[];
};

export const YearTabSidebar = ({ academicYears }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { academicYear, setActiveYear } = useAcademicYear();
  const router = useRouter();

  const handleSelect = async (currentValue: string) => {
    try {
      setIsLoading(true);
      const res = await axios.patch(`/api/academic-year/${currentValue}`, {
        active: true,
      });

      if (res.data) {
        const yearStartDate = new Date(res.data.yearStart);
        const yearEndDate = new Date(res.data.yearEnd);

        setActiveYear({
          id: res.data.id,
          label: `${yearStartDate.getFullYear()}/${yearEndDate.getFullYear()}`,
          yearStart: yearStartDate,
          yearEnd: yearEndDate,
        });
      }
      setOpen(false);
      toast.success("Academic year has been changed");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {academicYear?.id
            ? academicYears.find((year) => year.value === academicYear.id)
                ?.label
            : "Select year..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          {/* <CommandInput placeholder="Search year..." /> */}
          <CommandList className="w-[200px]">
            <CommandEmpty>No year found.</CommandEmpty>
            <CommandGroup>
              {academicYears.map((year) => (
                <CommandItem
                  key={year.value}
                  value={year.value}
                  onSelect={handleSelect}
                  disabled={isLoading}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      academicYear?.id === year.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {year.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem asChild>
                <Link href="/onboarding">
                  <PlusCircleIcon className="size-4 mr-2 text-main-1" /> Create
                  new
                </Link>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
