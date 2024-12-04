"use client";

import React from "react";

import { DateRange } from "react-day-picker";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getCurrentAndPast7DaysDate } from "@/utils/time";
import { getAttendanceStatusLabel, attendanceStatuses } from "@/utils/utils";

import { getDateRangeColumns } from "./column";

import { DatePicker } from "../components/DatePicker";
import Table from "../table/Table";
import DateRangeSummary from "./DateRangeSummary";

function DateRangeReport() {
  const [date, setDate] = React.useState<DateRange | undefined>(
    getCurrentAndPast7DaysDate()
  );
  const [cols, setCols] = React.useState<
    { field: string; headerName: string; getCallValue?: any }[]
  >(getDateRangeCols(date));

  const [loading, setLoading] = React.useState<boolean>(false);

  const [data, setData] = React.useState<any[] | undefined>();

  const getDateRangeSummary = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/api/date-range-summary?from=${date?.from?.toISOString()}&to=${date?.to?.toISOString()}`,
        { next: { revalidate: 300 } }
      );

      if (res.ok) {
        const attendance = await res.json();

        if (attendance.status === "success") {
          const employeeNames = Object.keys(attendance.data);

          const summaries = employeeNames.map((name) => {
            return {
              employeeName: name,
              employeeNumber: attendance.data[name].employeeNumber,
              summary: attendance.data[name].summary,
            };
          });

          setData(summaries);
        }
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getDateRangeSummary();
    setCols(getDateRangeCols(date))
  }, [date]);

  const handleDate = (from: any, to: any) => {
    setDate({ from, to });
  };

  const tabCls =
    "shadow-none rounded-none mr-2 bg-bg_primary data-[state=active]:border-accent data-[state=active]:border-b-[1px] data-[state=active]:text-accent data-[state=active]:bg-bg_primary";

  return (
    <>
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="bg-bg_primary ">
          <TabsTrigger value="summary" className={`${tabCls} w-[110px]`}>
            Summary
          </TabsTrigger>
          <TabsTrigger
            value="detailed_summary"
            className={`${tabCls} w-[150px]`}
          >
            Detailed Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="w-full">
          <div className="flex gap-x-2">
            <div>
              <DatePicker date={date} handleDate={handleDate} />
            </div>
          </div>

          <DateRangeSummary data={data} isLoading={loading} />
        </TabsContent>
        
        <TabsContent value="detailed_summary">
          <div className="flex gap-x-2">
            <div>
              <DatePicker date={date} handleDate={handleDate} />
            </div>

            <div className="flex gap-2 flex-wrap">
              {attendanceStatuses.map((status) => (
                <div className="flex-wrap flex gap-x-1 items-center font-bold">
                  <span
                    className="block w-[40px] text-center text-white rounded-md"
                    style={{
                      backgroundColor: status[1],
                    }}
                  >
                    {status[2]}
                  </span>
                  <span> - {status[0]}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mt-4 pr-2">
              <Table
                columns={cols}
                data={data}
                height={"h-[65vh]"}
                isLoading={loading}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

function getDateRangeCols(date: any) {
  const cols: any = [
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
    ...getDateRangeColumns(date.from, date.to),
  ];

  for (let i = 1; i < cols.length; i++) {
    const col = cols[i];

    cols[i]["getCellValue"] = (key: string, row: any) => {
      const att = row.summary.find(
        (s: { date: string; status: string }) => s.date === col.field
      );

      if (att?.date === col.field) {
        const label = getAttendanceStatusLabel(att.status);

        return (
          <div className="flex gap-x-3">
            <div>
              <p
                className="text-md text-white font-bold py-0.5 px-2 rounded-full"
                style={{ backgroundColor: label[1] }}
              >
                {label[2]}
              </p>
            </div>
          </div>
        );
      } else {
        return (
          <div className="flex gap-x-3">
            <div>
              <p className="text-md text-white font-bold py-0.5 px-2 rounded-full bg-[#CA8787]">
                A
              </p>
            </div>
          </div>
        );
      }
    };
  }

  return cols;
}

export default DateRangeReport;
