"use client";

import { Button } from "@/components/ui/button";
import SelectWithLabel from "@/components/ui/select-with-label";
import UpsertAcademicYearDialog from "@/components/upsert-academic-year-dialog";
import { AcademicYear } from "@prisma/client";
import axios from "axios";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  academicYears: AcademicYear[];
};

const ClientComp = ({ academicYears }: Props) => {
  const [open, setOpen] = useState(false);
  const activeAcademicYear = academicYears.find((ac) => ac.active);
  const [selectAcValue, setSelectAcValue] = useState(activeAcademicYear?.id);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const res = await axios.patch(`/api/academic-year/${selectAcValue}`, {
        active: true,
      });

      toast.success("Success to change academic year");
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to save");
    }

    setIsLoading(false);
  };

  const disabledCondition = isLoading;

  return (
    <>
      <UpsertAcademicYearDialog
        open={open}
        handleClose={() => setOpen(false)}
      />
      <div>
        <div className="p-8 flex [&>*]:flex-1">
          <div>
            <h6 className="font-semibold">Academic Year</h6>
            {activeAcademicYear && (
              <p className="text-xs">{`Now Active : ${activeAcademicYear.label}`}</p>
            )}
          </div>
          <div className="flex gap-2 items-end">
            <SelectWithLabel
              value={selectAcValue}
              items={academicYears.map((ac) => ({
                label: ac.label,
                value: ac.id,
              }))}
              label="Active Academic year"
              onValueChange={(e) => setSelectAcValue(e)}
              placeholder="Select academic year"
              containerClassName="w-full"
              disabled={disabledCondition}
            />
            <Button
              disabled={disabledCondition}
              variant="outline"
              onClick={() => setOpen(true)}
            >
              <PlusIcon size={16} />
            </Button>
          </div>
        </div>

        <div className="px-8 py-4 flex justify-end border-t">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </>
  );
};

export default ClientComp;
