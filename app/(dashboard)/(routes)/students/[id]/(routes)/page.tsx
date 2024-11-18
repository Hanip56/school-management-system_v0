import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import GridInfo from "@/components/grid-info";

const personalInformation = [
  {
    label: "First Name",
    content: "Rofiqur",
  },
  {
    label: "Last Name",
    content: "Rahman",
  },
  {
    label: "Email Address",
    content: "rofiqurahman@gmail.com",
  },
  {
    label: "Phone",
    content: "+62 0876 5432 1234",
  },
  {
    label: "Address",
    content: "Jl. Peta No 01234",
  },
  {
    label: "Sex",
    content: "Male",
  },
];

const StudentsDetailPage = () => {
  return (
    <div>
      <h5 className="font-semibold text-xl mb-4">Profile</h5>

      <div className="divide-y border-y">
        <div className="py-4 flex items-center justify-between">
          <div className="flex gap-4 items-center">
            {/* profile picture */}
            <div className="size-24 rounded-full bg-gray-200" />
            <div>
              <h6 className="font-semibold mb-1">Rofiqur Rahman</h6>
              <small className="block">rofiqurahman@gmail.com</small>
              <small className="block">098654321654</small>
            </div>
          </div>
          <div>
            <Button variant="outline">
              Edit <EditIcon className="size-3 ml-2" />
            </Button>
          </div>
        </div>

        <GridInfo title="Personal Information" lists={personalInformation} />
      </div>
    </div>
  );
};

export default StudentsDetailPage;
