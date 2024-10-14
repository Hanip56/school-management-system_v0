"use client";

import { useState } from "react";
import UpsertClassModal from "./upsert-class-modal";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const UpsertClassTrigger = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <UpsertClassModal open={open} handleClose={() => setOpen(false)} />
      <div>
        <Button variant="success" onClick={() => setOpen(true)}>
          <PlusIcon className="size-5 mr-2" /> Add class
        </Button>
      </div>
    </>
  );
};

export default UpsertClassTrigger;
