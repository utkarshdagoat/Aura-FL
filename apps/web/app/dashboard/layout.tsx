"use client";
import AsyncDashboardDynamic from "@/containers/async-dashboard-dynamic";
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AsyncDashboardDynamic>
        {children}
      </AsyncDashboardDynamic>
    </>
  );
};

export default DashboardLayout;
