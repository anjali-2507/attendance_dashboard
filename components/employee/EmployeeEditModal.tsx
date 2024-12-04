"use client";

import React, { useEffect } from "react";

import { FilePenLine } from "lucide-react";

import { useDispatch } from "react-redux";
import { useToast } from "../ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import SelectAmPm from "../components/SelectAmPm";
import Spinner from "../loaders/Spinner";

import { updateAttendanceItem } from "@/redux/features/attendance-slice";
import { updateEmployeesData, pushEmployeePage} from "@/redux/features/employee-slice";
import { useAppSelector } from "@/redux/store";

interface EditEmployeeDataProps {
  checkInTime: any;
  id: string | undefined;
  employeeName: string |undefined;
  employeeNumber: number | undefined;
  checkOutTime: any;
  shiftType: string | undefined;
  natureOfTime: string | undefined;
  bufferTime: string | undefined;
}

function EmployeeEditModal({ checkInTime, id, employeeName, employeeNumber,checkOutTime, shiftType, natureOfTime, bufferTime }: EditEmployeeDataProps) {

  const formattedCheckInTime = new Date(checkInTime)
    .toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .split(" ");
  const formattedCheckOutTime = new Date(checkOutTime)
    .toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .split(" ");

  const [inTime, setInTime] = React.useState(formattedCheckInTime[0]);
  const [outTime, setOutTime] = React.useState(formattedCheckOutTime[0]);   
  const [amPmIn, setAmPmIn] = React.useState(formattedCheckInTime[1]);
  const [amPmOut, setAmPmOut] = React.useState(formattedCheckOutTime[1]);
  const [selectedName,setSelectedName] = React.useState(employeeName);
  const [selectedNumber,setSelectedNumber] = React.useState<number | undefined>(employeeNumber);
  const [selectedBufferTime,setSelectedBufferTime] = React.useState(bufferTime)
  const [selectedShiftType, setSelectedShiftType] = React.useState(shiftType);
  const [selectedNatureOfType, setSelectedNatureOfType] = React.useState(natureOfTime);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleInTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedInTime = event.target.value;

    // Extract hours and minutes
    const [hours, minutes] = selectedInTime.split(":").map(Number);

    // Check if hours are between 1 and 12
    if (hours >= 1 && hours <= 12) {
      setInTime(selectedInTime);
    } else {
      // alert("Please select a time between 01:00 and 12:59.");
      toast({
        variant: "destructive",
        description: "Please select a time between 01:00 and 12:59.",
      });
    }
  };

  const handleOutTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOutTime = event.target.value;

    // Extract hours and minutes
    const [hours, minutes] = selectedOutTime.split(":").map(Number);

    // Check if hours are between 1 and 12
    if (hours >= 1 && hours <= 12) {
      setOutTime(selectedOutTime);
    } else {
      // alert("Please select a time between 01:00 and 12:59.");
      toast({
        variant: "destructive",
        description: "Please select a time between 01:00 and 12:59.",
      });
    }
  };


  const statuses = React.useMemo(
    () => [
      { label: "On time", id: "onTime" },
      { label: "Full day", id: "full-day" },
      { label: "Half day", id: "half-day" },
      { label: "Absent", id: "absent" },
    ],
    []
  );
  
  const shifts = React.useMemo(
    () => [
      { label: "Day", id: "day" },
      { label: "Night", id: "night" },
      { label: "Rotational", id: "rotational" },
    ],
    []
  );
  const natureOfTimes = React.useMemo(
    () => [
      { label: "Flexible", id: "Flexible" },
    ],
    []
  );  

  const getEmployeesData = async (pageNumber: number) => {
    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-employees?offset=${
          pageNumber * 10
        }`, { next: { revalidate: 600 } }
      );

      if (res.ok) {
        const employees = await res.json();

        if (employees.status === "success") {
          dispatch(pushEmployeePage({ total: employees.total, data: employees.data, pageNumber }));
        }
      }
    } catch (err) {

    } 
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      const [inHour, inMinute] = inTime.split(":");
      const [outHour, outMinute] = outTime.split(":");

      let updatedInTime = inTime;
      let updatedOutTime = outTime;

      if (amPmIn === "pm" && Number(inHour) !== 12) {
        updatedInTime = `${Number(inHour) + 12}:${inMinute}`;
      }
      if (amPmOut === "pm" && Number(outHour) !== 12) {
        updatedOutTime = `${Number(outHour) + 12}:${outMinute}`;
      }

      console.log(selectedName,selectedNumber,selectedBufferTime, updatedInTime, updatedOutTime, selectedShiftType, selectedNatureOfType)

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-employee`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          employeeId:id,
          employeeName:selectedName,
          employeeNumber:selectedNumber,
          bufferTime:selectedBufferTime,
          shiftType:selectedShiftType,
          natureOfTime: selectedNatureOfType,

          inTime:`${updatedInTime}:00`,
          checkInTime: checkInTime,
          outTime:`${updatedOutTime}:00`,
          checkOutTime: checkOutTime,
        })

      })
      if(res.status === 200){
        const data = await res.json()
        console.log(data)
        if(data.status ==="success"){
          console.log(" Inside success")
          dispatch(updateEmployeesData(id))
          getEmployeesData(0)
        }
        toast({
            description: "Employee data updated successfully",
        });
      }
      setIsModalOpen(false);

    } catch (err) {
      console.log(err)
      toast({
        variant: "destructive",
        description: "Failed to update attendace",
      });
    } finally {
      setIsModalOpen(false);
      setIsLoading(false);
    }
  };

  const handleAmPmInChange = (amPmIn: string) => {
    setAmPmIn(amPmIn);
  };
  const handleAmPmOutChange = (amPmOut: string) => {
    setAmPmOut(amPmOut);
  };


  //TODO Remove
  // useEffect(()=>{
  //   console.log(employeeName,employeeNumber,checkInTime, checkOutTime, shiftType, natureOfTime, bufferTime, employeeNumber, id, status,)
  // },[employeeName,employeeNumber,checkInTime, checkOutTime, shiftType, natureOfTime, bufferTime, employeeNumber, id, status])

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={(open) => setIsModalOpen(open)}>
        <DialogTrigger asChild>
          <button className="flex items-center py-1 px-3 rounded-md gap-x-2 bg-accent text-white">
            <FilePenLine className="h-[22px] w-[22px]" />
            Edit
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-bg_primary">
          <DialogHeader>
            <DialogTitle>Edit Employee Details</DialogTitle>
            <DialogDescription className="text-[10px]">Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-1 py-1">
              <label className="text-sm">Name:</label>
              <input
                type="text"
                value={selectedName as string}
                className="w-[100%] bg-bg_primary border-[1px] border-secondary py-1 px-1 rounded-md cursor-pointer"
                placeholder="Enter Name"
                onChange={(e)=>setSelectedName(e.target.value)}
              />
              <label className="text-sm">Number:</label>
              <input
                type="text"
                value={selectedNumber as number}
                className="w-[100%] bg-bg_primary border-[1px] border-secondary py-1 px-1 rounded-md cursor-pointer"
                placeholder="Enter Number"
                onChange={(e)=>setSelectedNumber(parseInt(e.target.value))}

              />
              <label className="text-sm">Buffer Time:</label>
              <input
                type="text"
                value={selectedBufferTime as string}
                className="w-[100%] bg-bg_primary border-[1px] border-secondary py-1 px-1 rounded-md cursor-pointer"
                placeholder="Enter Buffer Time"
                onChange={(e)=>setSelectedBufferTime(e.target.value)}
              />

            <label className="text-sm">Check In Time:</label>
            <div className="relative">
              <input
                type="time"
                value={inTime}
                className="w-[100%] bg-bg_primary border-[1px] border-secondary py-1 px-1 rounded-md cursor-pointer"
                onChange={handleInTimeChange}
              />
              <SelectAmPm amPm={amPmIn} handleAmPm={handleAmPmInChange} />
            </div>

            <label className="text-sm">Check Out Time:</label>
            <div className="relative">
              <input
                type="time"
                value={outTime}
                className="w-[100%] bg-bg_primary border-[1px] border-secondary py-1 px-1 rounded-md cursor-pointer"
                onChange={handleOutTimeChange}
              />
              <SelectAmPm amPm={amPmOut} handleAmPm={handleAmPmOutChange} />
            </div>


            <label className="text-sm">Shift Type:</label>
            <Select onValueChange={(value) => setSelectedShiftType(value)}>
              <SelectTrigger className="w-[100%] border-[1px] border-secondary px-1 rounded-md outline-none">
                <SelectValue placeholder={`${shiftType}`} />
              </SelectTrigger>
              <SelectContent className="bg-bg_primary">
                <SelectGroup>
                  {shifts.map((shift) => (
                    <SelectItem key={shift.id} value={shift.id}>
                      {shift.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <label className="text-sm">Nature of Time:</label>
            <Select onValueChange={(value) => setSelectedShiftType(value)}>
              <SelectTrigger className="w-[100%] border-[1px] border-secondary px-1 rounded-md outline-none">
                <SelectValue placeholder={`${natureOfTime}`} />
              </SelectTrigger>
              <SelectContent className="bg-bg_primary">
                <SelectGroup>
                  {natureOfTimes.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

          </div>
          <DialogFooter>
            <button
              type="submit"
              className="flex justify-center items-center bg-accent text-white py-1 px-3 rounded-md w-[140px] h-[38px]"
              disabled={isLoading}
              onClick={handleUpdate}
            >
              {isLoading ? <Spinner /> : "Save Changes"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EmployeeEditModal;
