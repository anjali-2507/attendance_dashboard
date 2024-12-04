"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import debounce from "lodash.debounce";

import { useAppSelector } from "@/redux/store";
import { pushAttendancePage } from "@/redux/features/attendance-slice";

import columns from "./column";

import Table from "../table/Table";
import AttendanceFilter from "./AttendanceFilter";
import Pagination from "../components/Pagination";
import AttendanceStats from "../dashboard/AttendanceStats";
import { initAttendanceSummary } from "@/redux/features/attendance-summary-slice";
import { updateUser } from "@/redux/features/user-slice";
import Greet from "../dashboard/Greet";

function LiveReport() {
  const attendances = useAppSelector((state) => state.attendance.value);
  const attendanceSummary = useAppSelector((state) =>
    state.attendanceSummary.value?.find((summary) => summary.type === "current")
  );

  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = React.useState<boolean>(false);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [maxPage, setMaxPage] = React.useState(0);

  const [data, setData] = React.useState<any[] | undefined>(
    attendances?.attendance
  );

  const getAttendanceData = async (pageNumber: number) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-attendances?offset=${
          pageNumber * 10
        }&type=live`,
        { next: { revalidate: 300 } }
      );

      if (res.ok) {
        const attendance = await res.json();

        if (attendance.status === "success") {
          dispatch(
            pushAttendancePage({
              total: attendance.total,
              data: attendance.data,
              pageNumber,
            })
          );

          setMaxPage(Math.ceil(attendance.total / 10));

          setData((prev) => [...(data ?? []), attendance.data]);
        }
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getAttendanceData(0);
  }, []);

  const handleClick = (row: any) => {
    const params = new URLSearchParams("");

    Object.keys(row).forEach((key) => {
      params.set(key, row[key]);
    });

    router.push(`/attendance/${row.employeeName}?${params.toString()}`);
  };

  const handleSearch = debounce((searchTerm: string) => {
    let filteredAttendance: any = [[]];

    if (!searchTerm || searchTerm.length === 0) {
      filteredAttendance = attendances?.attendance;
    }

    let pageCount = 0;

    attendances?.attendance.flat(2).forEach((attendance, i) => {
      if (attendance.employeeName.toLowerCase().includes(searchTerm)) {
        if (filteredAttendance[pageCount].length === 10) {
          filteredAttendance.push([]);
          pageCount++;
        }

        filteredAttendance[pageCount].push(attendance);
      }
    });

    setData(filteredAttendance);
  }, 250);

  const getPageData = async (type: string, pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= maxPage) {
      setCurrentPage(pageNumber);

      if (!attendances?.attendance[currentPage]) {
        await getAttendanceData(currentPage);
      }
    }
  };

  React.useEffect(() => {
    if (!attendanceSummary) {
      const getStats = async () => {
        try {
          // setLoading(true);

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/stats`,
            { next: { revalidate: 300 } }
          );

          if (res.ok) {
            const data = await res.json();

            dispatch(
              initAttendanceSummary({ ...data.data.summary, type: "current" })
            );
            dispatch(updateUser(data.data.user));
          }
        } catch (err) {
        } finally {
          // setLoading(false);
        }
      };

      getStats();
    }
  }, []);

  return (
    <>
      <div className="ml-1 mb-6">
        <p className="text-secondary">
          Today,{" "}
          <span className="text-accent font-semibold">
            {new Date().toLocaleDateString("en-GB", { dateStyle: "medium" })}
          </span>
        </p>
      </div>

      <AttendanceStats data={attendanceSummary} />

      <AttendanceFilter handleSearch={handleSearch} />

      <div className="mt-4 pr-2">
        <Table
          columns={columns}
          data={data?.[currentPage - 1] ?? []}
          height={"h-[65vh]"}
          handleClick={handleClick}
          isLoading={loading}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        maxPageCount={maxPage}
        handleClick={getPageData}
      />{" "}
    </>
  );
}

export default LiveReport;
