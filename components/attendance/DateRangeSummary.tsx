import React from "react";

import Table from "../table/Table";

function DateRangeSummary({
  data,
  isLoading,
}: {
  data: any;
  isLoading: boolean;
}) {
  let rows: any[] = [];

  if (data) {
    const summary: Record<string, any> = {};

    data.forEach((attendance: any) => {
      if (!summary[attendance.employeeName]) {
        summary[attendance.employeeName] = {
          employeeName: attendance.employeeName,
          employeeNumber: attendance.employeeNumber,
          totalCheckIn: 0,
          totalLate: 0,
          totalOnTime: 0,
          totalFullDay: 0,
          totalHalfDay: 0,
          totalAbsent: 0,
        };
      }

      attendance.summary.forEach((summ: any) => {
        summary[attendance.employeeName].totalCheckIn++;

        if (summ.status === "onTime") {
          summary[attendance.employeeName].totalOnTime++;
        } else if (summ.status === "late") {
          summary[attendance.employeeName].totalLate++;
        } else if (summ.status === "half-day") {
          summary[attendance.employeeName].totalHalfDay++;
        } else if (summ.status === "absent") {
          summary[attendance.employeeName].totalAbsent++;
        } else if (summ.status === "full-day") {
          summary[attendance.employeeName].totalFullDay++;
        }
      });
    });

    const employeeNames = Object.keys(summary);

    rows = employeeNames.map((name) => ({
      employeeName: name,
      ...summary[name],
    }));
  }

  const columns = React.useMemo(
    () => [
      {
        field: "employee",
        headerName: "Employee",
        getCellValue: (key: string, row: any) => (
          <div className="flex gap-x-3">
            <div>
              <p className="text-[16px] font-bold text-accent">
                {row.employeeName}
              </p>
              <p className="text-[14px]">{row.employeeNumber}</p>
            </div>
          </div>
        ),
      },
      {
        field: "totalCheckIn",
        headerName: "Total Check In",
      },
      {
        field: "totalOnTime",
        headerName: "Total On Time",
      },
      {
        field: "totalLate",
        headerName: "Total Late",
      },
      {
        field: "totalFullDay",
        headerName: "Total Full Day",
      },
      {
        field: "totalFullDay",
        headerName: "Total Full Day",
      },
    ],
    []
  );

  return (
    <div>
      <div className="mt-4 pr-2">
        <Table
          columns={columns}
          data={rows}
          height={"h-[65vh]"}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default DateRangeSummary;
