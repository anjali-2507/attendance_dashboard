"use client";

import React from "react";

import { useSearchParams } from "next/navigation";

import { useAppSelector } from "@/redux/store";

import { getAttendanceStatusLabel, timePassedSinceCheckIn } from "@/utils/utils";
import { formatDate, formatTime12Hour } from "@/utils/time";

function AttendanceCard() {
  const searchParams = useSearchParams();
  const attendances = useAppSelector(state => state.attendance.value)

  const id = searchParams.get("id")
  
  const attendance = attendances && attendances?.attendance?.flat(2)?.find?.(attendance => attendance.id === id);

  const status = getAttendanceStatusLabel(attendance?.status);

  return (
    <div className="mt-4">
      <div
        className="p-3"
        style={{
          borderLeft: `2px solid ${status[1]}`,
        }}
      >
        <div className="flex items-center">
          <p className="mr-8 text-md text-secondary">{formatDate(attendance?.date, "Asia/Kolkata")}</p>
          <div>
            <p className="text-secondary text-[14px] flex gap-x-2 items-center">
              <span
                className="w-[5px] h-[5px] rounded-full"
                style={{
                  backgroundColor: status[1],
                }}
              ></span>
              <span>{status[0]}</span>
            </p>
          </div>
        </div>

        <div className="flex mt-5">
            <div className="mr-8">
                <p className="text-md text-secondary">Check In</p>
                <p className=" mt-1">{formatTime12Hour(attendance?.checkInTime, "Asia/Kolkata")}</p>
            </div>
            <div>
                <p className="text-md text-secondary">Total</p>
                <p className="mt-1">{attendance?.timeSpent ? attendance?.timeSpent : timePassedSinceCheckIn(attendance?.checkInTime)}</p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceCard;
