import React from "react";

import Breadcrumbs from "@/components/components/Breadcrumbs";

import AttendanceTable from "@/components/attendance/AttendanceTable";

function Page() {
  const breadcrumbs = [
    { href: "/", label: "Home" },
    { href: "/attendance", label: "Attendance" },
  ];
  
  return (
    <div className="h-[90dvh] overflow-y-scroll">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="mt-3">
        <h1 className="text-2xl font-bold text-accent">Attendance</h1>
      </div>

      <AttendanceTable />
    </div>
  );
}

export default Page;
