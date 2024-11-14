"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusIcon, SquareArrowOutUpRightIcon, TrashIcon } from "lucide-react";
import { UpdateIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Class } from "@prisma/client";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UpsertClassModal from "./upsert-class-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  classes: Class[];
};

const ClientComp = ({ classes }: Props) => {
  const router = useRouter();
  const [isUpdateOpen, setIsUpdateOpen] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You're going to delete this class"
  );
  const [search, setSearch] = useState("");

  const handleDelete = async (id: string) => {
    const ok = await confirm();

    if (!ok) return;

    try {
      setIsLoading(true);
      const res = await axios.delete(`/api/class/${id}`);

      toast.success("Class successfully deleted");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };

  const disabledCondition = isLoading;

  const initialData = isUpdateOpen
    ? classes.find((c) => c.id === isUpdateOpen)
    : undefined;

  const filteredClasses = search
    ? classes.filter((c) =>
        c.name.trim().toLowerCase().includes(search.trim().toLowerCase())
      )
    : classes;

  return (
    <>
      <ConfirmationDialog />
      <UpsertClassModal
        open={!!isUpdateOpen}
        handleClose={() => setIsUpdateOpen("")}
        initialData={initialData}
      />

      <main>
        <div className="w-full py-3 border-b flex items-center justify-between">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
            placeholder="Search class"
          />
          <div className="flex gap-2 items-center">
            <Button variant="outline">Filter</Button>
            <Button variant="success" onClick={() => setIsUpdateOpen("new")}>
              <PlusIcon className="size-5 mr-2" /> Add class
            </Button>
          </div>
        </div>

        {/* class-cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
          {filteredClasses.map((classs, i) => (
            <Card key={classs.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="border-b py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{classs.name}</CardTitle>
                  <Link
                    href={`classes/${classs.id}`}
                    className="hover:text-emerald-600"
                  >
                    <SquareArrowOutUpRightIcon className="size-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <h4 className="text-2xl font-bold"></h4>
                <div className="text-sm">
                  <p>Students: 42</p>
                  <p>Session/week: 120</p>
                </div>
              </CardContent>
              <CardFooter className="border-t text-xs flex items-center gap-4 py-3">
                <button
                  className="flex items-center hover:text-red-600/80 disabled:text-muted-foreground"
                  onClick={() => handleDelete(classs.id)}
                  disabled={disabledCondition}
                >
                  <TrashIcon className="size-3 mr-2" /> Delete
                </button>
                <button
                  className="flex items-center hover:text-emerald-600/80 disabled:text-muted-foreground"
                  onClick={() => setIsUpdateOpen(classs.id)}
                  disabled={disabledCondition}
                >
                  <UpdateIcon className="size-3 mr-2" /> Update
                </button>
              </CardFooter>
            </Card>
          ))}
          {filteredClasses.length < 1 && <p>Class not found.</p>}
        </div>
      </main>
    </>
  );
};

export default ClientComp;
