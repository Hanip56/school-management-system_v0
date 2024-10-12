import React from "react";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <main className="pt-[var(--navbar-height)] md:pt-0 md:pl-[var(--sidebar-width)]">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
