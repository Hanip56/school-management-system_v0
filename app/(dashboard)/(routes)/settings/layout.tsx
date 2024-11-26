import { Card } from "@/components/ui/card";
import TabsNav from "./components/tabs-nav";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div>
        <header>
          <h1 className="text-2xl font-semibold mt-4 py-4 px-10">Settings</h1>
        </header>
      </div>

      <TabsNav>
        <div className="p-2 py-6 md:px-8">
          <Card className="shadow-none border">{children}</Card>
        </div>
      </TabsNav>
    </div>
  );
};

export default SettingsLayout;
