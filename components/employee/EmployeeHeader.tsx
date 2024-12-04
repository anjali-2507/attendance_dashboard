"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { useSearchParams } from "next/navigation";

import Breadcrumbs from "@/components/components/Breadcrumbs";
import EditAttendance from "../attendance/EditAttendance";

import { useAppSelector } from "@/redux/store";
import EmployeeEditModal from "./EmployeeEditModal";

interface EmployeeHeaderProps {
  type: "employee" | "attendance";
}

function EmployeeHeader({ type }: EmployeeHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("_id")

  const user = useAppSelector(state => state.user.value)
  const employees = useAppSelector(state=>state.employees.value)
  const employeeData = employees?.employee.flat(1)[0]
  // const employeeData = ''
  const employeeName = searchParams.get("employeeName");

  const breadcrumbs = [{ href: "/", label: "Home" }];

  if (type === "attendance") {
    breadcrumbs.push(
      { href: "/attendance", label: "Attendance" },
      { href: `/attendance/${employeeName}`, label: employeeName as string }
    );
  } else {
    breadcrumbs.push(
      { href: "/employee", label: "Employee" },
      { href: `/employee/${employeeData?.employeeName}`, label: employeeData?.employeeName as string }
    );
  }
  useEffect(()=>{
    console.log(user)
    console.log("Employees: ", employees?.employee.flat(1).find(e=>id===e._id))
  },[])

  return (
    <>
      <div className="flex items-center gap-x-4 py-2">
        <button
          className="bg-bg_secondary cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-[22px] w-[22px]" />
        </button>
      </div>
      <div className="flex justify-between">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        {type === "attendance" && (user?.role === "employer" || user?.role === "admin") ? (
          <EditAttendance
            checkInTime={searchParams.get("checkInTime")}
            status={searchParams.get("status")}
            id={searchParams.get("_id")}
          />
        ) : (
          <>
          <EmployeeEditModal
            checkInTime={employeeData?.checkIn}
            id={employeeData?._id}
            employeeName = {employeeData?.employeeName}
            employeeNumber={employeeData?.employeeNumber}
            checkOutTime={employeeData?.checkOut}
            shiftType={employeeData?.shiftType}
            natureOfTime={employeeData?.natureOfTime}
            bufferTime={employeeData?.bufferTime}
          />
          </>
        )}
      </div>
    </>
  );
}

export default EmployeeHeader;
