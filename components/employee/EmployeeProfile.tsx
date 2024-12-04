"use client";

import React, { useEffect } from "react";

import { useSearchParams } from "next/navigation";

import { FaCircleUser } from "react-icons/fa6";

import { Badge } from "../ui/badge";
import EmployeeCard from "./EmployeeCard";
import { useAppSelector } from "@/redux/store";

interface EmployeeProfileProps {
  type: "employee" | "attendance";
}

function EmployeeProfile({ type }: EmployeeProfileProps) {
  const searchParams = useSearchParams();
  const employees= useAppSelector(state=>state.employees.value)
  const employeeData = employees?.employee.flat(2).find((e)=>e._id===searchParams.get("_id"))

  const employeeName = searchParams.get("employeeName");
  const employeeNumber = searchParams.get("employeeNumber");
  const role = searchParams.get("role");

  let employeePic = "";

  if (type === "attendance") {
    employeePic = searchParams.get("checkInPic") as string;
  }

  useEffect(()=>{
    console.log("Employees Profile: ",employeeData)
  },[])

  return (
    <div>
      <div className="flex gap-x-4 mt-8 border-b-[1px] border-secondary/[0.25] pb-4">
        <div>
          {employeePic ? (
            <img
              src={employeePic}
              alt={employeeName ?? ""}
              className="w-32 h-36 rounded-md"
            />
          ) : (
            <FaCircleUser className="w-32 h-36 text-secondary" />
          )}
        </div>
        <div>
          <p className="text-xl font-bold text-accent">{employeeData?.employeeName || searchParams.get("employeeName")}</p>
          <p className="text-md text-gray-600">{employeeData?.employeeNumber || searchParams.get("employeeNumber")}</p>
          <Badge className="bg-accent text-white">{employeeData?.role || searchParams.get("role")}</Badge>
        </div>
      </div>
      {/* Adding Other details */}
      {
        type === "employee" && (<>
          <EmployeeCard
        id={employeeData?._id}
        employeeName={employeeData?.employeeName}
        employeeNumber={employeeData?.employeeNumber}
        checkInTime={employeeData?.checkIn}
        checkOutTime={employeeData?.checkOut}
        shiftType={employeeData?.shiftType}
        natureOfTime={employeeData?.natureOfTime}
        bufferTime={employeeData?.bufferTime}
        
      />
          
        </>)
      }
      
    </div>
  );
}

export default EmployeeProfile;
