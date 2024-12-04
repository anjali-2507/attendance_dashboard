import React from "react";

import EmployeeHeader from "@/components/employee/EmployeeHeader";
import EmployeeProfile from "@/components/employee/EmployeeProfile";
import AttendanceCard from "@/components/attendance/AttendanceCard";

function Page() {
  return (
    <div>
      <EmployeeHeader type="attendance" />
      <EmployeeProfile type="attendance" />

      <div>
        <h2 className="text-secondary text-xl mt-3">Attendance Details</h2> 
        <AttendanceCard />
      </div>
    </div>
  );
}

export default Page;
