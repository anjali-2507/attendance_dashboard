import React from "react";

import EmployeeHeader from "@/components/employee/EmployeeHeader";
import EmployeeProfile from "@/components/employee/EmployeeProfile";

function Page() {
  return (
    <div>
      <EmployeeHeader type="employee"/>
      <EmployeeProfile type="employee" />
    </div>
  );
}

export default Page;
