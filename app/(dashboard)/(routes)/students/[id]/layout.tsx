import BreadcrumbNav from "@/components/breadcrumb-nav";
import TabsNavigation from "./components/tabs-navigation";

const StudentDetailLayoutPage = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="container-dashboard">
      <header className="mb-6">
        {/* <p className="font-medium">✨ Detail Class</p> */}
        <h1 className="text-3xl font-semibold my-1">Student detail</h1>
        <BreadcrumbNav />
      </header>

      <div className="bg-zinc-100 rounded-xl p-6 flex divide-x w-full min-h-96">
        {/* navigations */}
        <div className="basis-[20%] flex-shrink-0">
          <TabsNavigation />
        </div>
        {/* contents */}
        <div className="flex-1 w-full px-6">{children}</div>
      </div>
    </div>
  );
};

export default StudentDetailLayoutPage;
