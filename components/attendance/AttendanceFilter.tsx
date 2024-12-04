"use client";

import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse"; // For CSV export
import * as XLSX from "xlsx"; // For Excel export
import { jsPDF } from "jspdf"; // For PDF export

interface AttendanceFilterProps {
  handleSearch: (searchTerm: string) => void;
  children?: React.ReactNode;
}

function AttendanceFilter({ handleSearch, children }: AttendanceFilterProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const exportData = (format: string) => {
    const dataToExport = [
      { employeeName: "John Doe", employeeNumber: "12345", date: "2024-12-04", status: "Present" },
      { employeeName: "Jane Smith", employeeNumber: "67890", date: "2024-12-04", status: "Absent" },
    ]; // Example data, adjust according to your actual data structure

    switch (format) {
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
    <>
      {/* Export Button with Dropdown */}
      <div className="relative flex justify-end mb-4 mr-[60px] mt-[-60px]" ref={dropdownRef}>
        <button
          onClick={() => setDropdownVisible(!dropdownVisible)} // Toggle dropdown visibility
          className="bg-accent text-white py-2 px-4 rounded-md"
        >
          Export&nbsp;
        </button>
        {dropdownVisible && (
          <div className="absolute bg-white shadow-lg rounded-md mt-2 right-0 w-48">
            <div
              onClick={() => {
                exportData("pdf");
                setDropdownVisible(false); // Hide dropdown after export
              }}
              className="cursor-pointer hover:bg-gray-200 p-2"
            >
              Export to PDF
            </div>
            <div
              onClick={() => {
                exportData("excel");
                setDropdownVisible(false); // Hide dropdown after export
              }}
              className="cursor-pointer hover:bg-gray-200 p-2"
            >
              Export to Excel
            </div>
            <div
              onClick={() => {
                exportData("csv");
                setDropdownVisible(false); // Hide dropdown after export
              }}
              className="cursor-pointer hover:bg-gray-200 p-2"
            >
              Export to CSV
            </div>
          </div>
        )}
      </div>
      <div className="flex py-3 my-4 gap-x-2">
        <div>
          <input
            className="focus:border-accent bg-bg_primary py-1 px-2 outline-none w-[200px] border-b-[1px] border-secondary"
            placeholder="Search..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {children}
      </div>
    </>
  );
}

export default AttendanceFilter;
