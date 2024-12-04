"use client";

import React from "react";

import classNames from "classnames";

import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store";

import { initAttendanceSummary } from "@/redux/features/attendance-summary-slice";
import { updateUser } from "@/redux/features/user-slice";

import Greet from "@/components/dashboard/Greet";
import AttendanceStats from "@/components/dashboard/AttendanceStats";
import Loading from "@/components/Loading";

export default function Home() {
  const attendanceSummary = useAppSelector(
    (state) => state.attendanceSummary.value
  );
  const user = useAppSelector((state) => state.user.value);

  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();

  React.useEffect(() => {
    const getStats = async () => {
      try {
        setLoading(true);

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
        setLoading(false);
      }
    };

    getStats();
  }, []);

  return (
    <main
      className={classNames({
        "transition-all duration-150 linear mt-3": true,
      })}
    >
      {user ? (
        <Greet name={user?.name} role={user?.role} phone={user?.number} />
      ) : (
        <></>
      )}

      {user?.role === "employer" || user?.role === "admin" ? (
        <AttendanceStats
          data={attendanceSummary?.find((s) => s.type === "current")}
        />
      ) : (
        <></>
      )}

      {loading ? <div className="w-[85dvw] h-[95dvh] flex justify-center items-center"><Loading isVisible={loading} /></div> : <></>}
    </main>
  );
}
