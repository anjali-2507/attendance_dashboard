"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import debounce from "lodash.debounce";

import { Badge } from "@/components/ui/badge";

import Table from "../table/Table";
import EmployeeModal from "@/components/modals/EmployeeModal";

import { useAppSelector } from "@/redux/store";
import { pushEmployeePage } from "@/redux/features/employee-slice";
import EmployeeFilter from "./EmployeeFilter";
import Pagination from "../components/Pagination";
import { attendance, pushAttendancePage } from "@/redux/features/attendance-slice";

function EmployeeTable() {
  const employees = useAppSelector((state) => state.employees.value);
  const dispatch = useDispatch();
  const router = useRouter();

  const [employee, setEmployee] = React.useState<null | any>(null);
  console.log(employees)
  const [data, setData] = React.useState<any[] | undefined>(employees?.employee);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [maxPage, setMaxPage] = React.useState(0);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const getEmployeesData = async (pageNumber: number) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-employees?offset=${
          pageNumber * 10
        }`, { next: { revalidate: 600 } }
      );

      if (res.ok) {
        const employees = await res.json();

        if (employees.status === "success") {
          setMaxPage(Math.ceil(employees.total / 10));
          setData(() => [...(data ?? []), employees.data]);
          dispatch(pushEmployeePage({ total: employees.total, data: employees.data, pageNumber }));
        }
      }
    } catch (err) {

    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getEmployeesData(0);
  }, []);

  const columns = React.useMemo(
    () => [
      {
        field: "employee",
        headerName: "Employee",
        getCellValue: (key: string, row: any) => (
          <div>
            <p className="text-[16px] font-bold text-accent">
              {row.employeeName}
            </p>
            <p className="text-[14px]">{row.employeeNumber}</p>
          </div>
        ),
      },
      {
        field: "checkIn",
        headerName: "Check In Time",
        getCellValue: (key: string, row: any) => (
          <p className="text-md">
            {new Date(row.checkIn).toLocaleString("en-GB", {
              timeZone: row.timeZone,
              hour12: true,
              minute: "2-digit",
              hour: "2-digit",
            })}
          </p>
        ),
      },
      {
        field: "natureOfTime",
        headerName: "Timing Type",
        getCellValue: (key: string, row: any) => {
          if (row.natureOfTime === "Flexible") {
            return <Badge className="bg-[#C75B7A]">{row.natureOfTime}</Badge>;
          } else {
            return <Badge className="bg-[#FF8225]">{row.natureOfTime}</Badge>;
          }
        },
      },
      {
        field: "role",
        headerName: "Role",
      },
      {
        field: "shiftType",
        headerName: "Shift Type",
      },
    ],
    []
  );

  const handleClick = (row: any) => {
    const params = new URLSearchParams("");

    Object.keys(row).forEach((key) => {
      params.set(key, row[key]);
    });

    router.push(`/employee/${row.employeeName}/?${params.toString()}`);
  };

  const handleSearch = debounce((searchTerm: string) => {
    let filteredEmployees: any = [[]];

    if (!searchTerm || searchTerm.length === 0) {
      filteredEmployees = employees?.employee;
    }

    let pageCount = 0;

    employees?.employee.flat(2).forEach((employee, i) => {
      if (employee?.employeeName?.toLowerCase().includes(searchTerm)) {
        if (filteredEmployees[pageCount].length === 10) {
          filteredEmployees.push([]);
          pageCount++;
        }

        filteredEmployees[pageCount].push(employee);
      }
    });

    setData(filteredEmployees);
  }, 250);

  const getPageData = async (type: string, pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= maxPage) {
      setCurrentPage(pageNumber);

      if (!employees?.employee[currentPage]) {
        await getEmployeesData(currentPage);
      }
    }
  };

  return (
    <>
      <EmployeeFilter handleSearch={handleSearch} />
      
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
      />

      {isModalOpen ? (
        <EmployeeModal
          isModalOpen={isModalOpen}
          handelModalClose={(open) => setIsModalOpen(false)}
          employee={employee}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default EmployeeTable;
