import { formatDateToMMDD, formatTime12Hour } from "@/utils/time";
import {
  getAttendanceStatusLabel,
  timePassedSinceCheckIn,
} from "@/utils/utils";

const columns = [
  {
    field: "employee",
    headerName: "Employee",
    getCellValue: (key: string, row: any) => (
      <div className="flex gap-x-3">
        <img
          src={row.checkInPic}
          className="rounded-md w-[40px] h-[44px]"
          alt={row.employeeName}
        />
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
    field: "date",
    headerName: "Date",
    getCellValue: (key: string, row: any) => (
      <p>
        {new Date(row.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "2-digit",
          year: "2-digit",
        })}
      </p>
    ),
  },
  {
    field: "checkIn",
    headerName: "Shift Time",
    getCellValue: (key: string, row: any) => (
      <p>
        <span className="text-accent">
          {formatTime12Hour(row.checkIn, row.timeZone)}
        </span>
      </p>
    ),
  },
  {
    field: "checkInTime",
    headerName: "Check In Time",
    getCellValue: (key: string, row: any) => (
      <p className="text-md">
        {formatTime12Hour(row.checkInTime, row.timeZone)}
      </p>
    ),
  },
  {
    field: "timeSpent",
    headerName: "Duration",
    getCellValue: (key: string, row: any) => (
      <p className="text-md">{timePassedSinceCheckIn(row.checkInTime)}</p>
    ),
  },
  {
    field: "status",
    headerName: "Status",
    getCellValue: (key: string, row: any) => {
      const status = getAttendanceStatusLabel(row.status);

      return (
        <p
          className={`w-fit font-bold text-white text-md rounded-md px-2 py-1`}
          style={{
            backgroundColor: status[1],
          }}
        >
          {status[0]}
        </p>
      );
    },
  },
];

export default columns;

export function getDateRangeColumns(fromDate: Date, toDate: Date) {
  const dates = [];
  const currentDate = new Date(fromDate);

  while (currentDate <= toDate) {
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const dateinMonthDay = formatDateToMMDD(currentDate);

    dates.push({
      field: dateinMonthDay,
      headerName: formattedDate,
      
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
