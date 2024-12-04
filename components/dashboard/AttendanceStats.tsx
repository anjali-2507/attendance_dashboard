import React, { useState } from "react";
import { CalendarX2, Users2, CalendarCheck2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Papa from "papaparse"; // For CSV export
import * as XLSX from "xlsx"; // For Excel export
import { jsPDF } from "jspdf"; // For PDF export

function AttendanceStats({
  data,
}: {
  data: AttendanceSummary | undefined;
}) {
  const [exportFormat, setExportFormat] = useState("csv");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const cards = [
    {
      label: "Total Employees",
      icon: (
        <Users2 className="h-[22px] w-[22px] transition-all group-hover:scale-110 text-amber-600" />
      ),
      count: data?.totalEmployees ?? 0,
    },
    {
      label: "Present Employees",
      icon: (
        <CalendarCheck2 className="h-[22px] w-[22px] transition-all group-hover:scale-110 text-lime-600" />
      ),
      count: data?.presentCount ?? 0,
    },
    {
      label: "Absent Employees",
      icon: (
        <CalendarX2 className="h-[22px] w-[22px] transition-all group-hover:scale-110 text-rose-600" />
      ),
      count: data?.absentCount ?? 0,
    },
    {
      label: "On Time Employees",
      icon: (
        <CalendarX2 className="h-[22px] w-[22px] transition-all group-hover:scale-110 text-rose-600" />
      ),
      count: data?.onTimeCount ?? 0,
    },
    {
      label: "Late Employees",
      icon: (
        <CalendarX2 className="h-[22px] w-[22px] transition-all group-hover:scale-110 text-rose-600" />
      ),
      count: data?.lateCount ?? 0,
    },
    {
      label: "Full Day Employees",
      icon: (
        <CalendarX2 className="h-[22px] w-[22px] transition-all group-hover:scale-110 text-rose-600" />
      ),
      count: data?.fullDayCount ?? 0,
    },
    {
      label: "Half Day Employees",
      icon: (
        <CalendarX2 className="h-[22px] w-[22px] transition-all group-hover:scale-110 text-rose-600" />
      ),
      count: data?.halfDayCount ?? 0,
    },
  ];

  // Export Functions
  const exportToCSV = (data: any[]) => {
    const formattedData = data.map((row) => ({
      Employee: row.employeeName,
      EmployeeNumber: row.employeeNumber,
      Date: new Date(row.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "2-digit",
        year: "2-digit",
      }),
      Status: row.status,
    }));

    const csv = Papa.unparse(formattedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "attendance_data.csv";
    link.click();
  };

  const exportToExcel = (data: any[]) => {
    const formattedData = data.map((row) => ({
      Employee: row.employeeName,
      EmployeeNumber: row.employeeNumber,
      Date: new Date(row.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "2-digit",
        year: "2-digit",
      }),
      Status: row.status,
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Data");
    XLSX.writeFile(wb, "attendance_data.xlsx");
  };

  const exportToPDF = (data: any[]) => {
    const doc = new jsPDF();
    const formattedData = data.map((row) => ({
      Employee: row.employeeName,
      EmployeeNumber: row.employeeNumber,
      Date: new Date(row.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "2-digit",
        year: "2-digit",
      }),
      Status: row.status,
    }));

    let yPosition = 10;
    formattedData.forEach((row) => {
      doc.text(
        `${row.Employee}, ${row.EmployeeNumber}, ${row.Date}, ${row.Status}`,
        10,
        yPosition
      );
      yPosition += 10;
    });

    doc.save("attendance_data.pdf");
  };

  const exportData = () => {
    const dataToExport = [
      { employeeName: "John Doe", employeeNumber: "12345", date: "2024-12-04", status: "Present" },
      { employeeName: "Jane Smith", employeeNumber: "67890", date: "2024-12-04", status: "Absent" },
    ]; // Example data, adjust according to your actual data structure

    switch (exportFormat) {
      case "excel":
        exportToExcel(dataToExport);
        break;
      case "pdf":
        exportToPDF(dataToExport);
        break;
      default:
        exportToCSV(dataToExport);
    }
  };

  return (
    <div>


      <div className="flex flex-wrap gap-x-5 gap-y-5 mt-4">
        {cards.map((card) => (
          <Card
            className="md:w-[225px] max-md:w-[95%] bg-bg_primary border-[1px] border-zinc-300"
            key={card.label}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}

export default AttendanceStats;
