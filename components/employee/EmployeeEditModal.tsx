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
import { updateEmployeesData, pushEmployeePage } from "@/redux/features/employee-slice";
import { useAppSelector } from "@/redux/store";

interface EditEmployeeDataProps {
  checkInTime: any;
  id: string | undefined;
  employeeName: string | undefined;
  employeeNumber: number | undefined;
  checkOutTime: any;
  shiftType: string | undefined;
  natureOfTime: string | undefined;
  bufferTime: string | undefined;
}

function EmployeeEditModal({
  checkInTime,
  id,
  employeeName,
  employeeNumber,
  checkOutTime,
  shiftType,
  natureOfTime,
  bufferTime,
}: EditEmployeeDataProps) {
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
  const [selectedName, setSelectedName] = React.useState(employeeName);
  const [selectedNumber, setSelectedNumber] = React.useState<number | undefined>(employeeNumber);
  const [selectedBufferTime, setSelectedBufferTime] = React.useState(bufferTime);
  const [selectedShiftType, setSelectedShiftType] = React.useState(shiftType);
  const [selectedNatureOfType, setSelectedNatureOfType] = React.useState(natureOfTime);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleInTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedInTime = event.target.value;
    const [hours, minutes] = selectedInTime.split(":").map(Number);

    if (hours >= 1 && hours <= 12) {
      setInTime(selectedInTime);
    } else {
      toast({
        variant: "destructive",
        description: "Please select a time between 01:00 and 12:59.",
      });
    }
  };

  const handleOutTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOutTime = event.target.value;
    const [hours, minutes] = selectedOutTime.split(":").map(Number);

    if (hours >= 1 && hours <= 12) {
      setOutTime(selectedOutTime);
    } else {
      toast({
        variant: "destructive",
        description: "Please select a time between 01:00 and 12:59.",
      });
    }
  };

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

      console.log('Updating Employee:', {
        employeeId: id,  
        employeeName: selectedName,
        employeeNumber: selectedNumber,
        bufferTime: selectedBufferTime,
        shiftType: selectedShiftType,
        natureOfTime: selectedNatureOfType,
        checkIn: `${updatedInTime}:00`,
        CheckOut: `${updatedOutTime}:00`,
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-employee`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: id,  
          employeeName: selectedName,
          employeeNumber: selectedNumber,
          bufferTime: selectedBufferTime,
          shiftType: selectedShiftType,
          natureOfTime: selectedNatureOfType,
          inTime: `${updatedInTime}:00`,
          outTime: `${updatedOutTime}:00`,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        if (data.status === "success") {
          toast({ description: "Employee data updated successfully" });
          dispatch(updateEmployeesData(id));  // Ensure this action reflects the changes
        }
      }
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", description: "Failed to update attendance" });
    } finally {
      setIsModalOpen(false);
      setIsLoading(false);
    }
  };

  const handleAmPmInChange = (amPmIn: string) => {
    setAmPmIn(amPmIn);
    if (amPmIn === "pm" && inTime.split(":")[0] !== "12") {
      setInTime(`${parseInt(inTime.split(":")[0], 10) + 12}:${inTime.split(":")[1]}`);
    }
  };

  const handleAmPmOutChange = (amPmOut: string) => {
    setAmPmOut(amPmOut);
    if (amPmOut === "pm" && outTime.split(":")[0] !== "12") {
      setOutTime(`${parseInt(outTime.split(":")[0], 10) + 12}:${outTime.split(":")[1]}`);
    }
  };

  return (
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
          {/* Employee Name, Number, and Buffer Time */}
          <label className="text-sm">Name:</label>
          <input
            type="text"
            value={selectedName as string}
            className="w-[100%] bg-bg_primary border-[1px] border-secondary py-1 px-1 rounded-md cursor-pointer"
            placeholder="Enter Name"
            onChange={(e) => setSelectedName(e.target.value)}
          />
          <label className="text-sm">Number:</label>
          <input
            type="text"
            value={selectedNumber as number}
            className="w-[100%] bg-bg_primary border-[1px] border-secondary py-1 px-1 rounded-md cursor-pointer"
            placeholder="Enter Number"
            onChange={(e) => setSelectedNumber(parseInt(e.target.value))}
          />
          <label className="text-sm">Buffer Time:</label>
          <input
            type="text"
            value={selectedBufferTime as string}
            className="w-[100%] bg-bg_primary border-[1px] border-secondary py-1 px-1 rounded-md cursor-pointer"
            placeholder="Enter Buffer Time"
            onChange={(e) => setSelectedBufferTime(e.target.value)}
          />

          {/* Check-in Time Input */}
          <div className="grid gap-1 py-1">
            <label className="text-sm">Check-in Time:</label>
            <input
              type="time"
              value={inTime}
              onChange={handleInTimeChange}
              className="w-[100%] bg-bg_primary border-[1px] border-secondary py-1 px-1 rounded-md"
            />
            <SelectAmPm value={amPmIn} onValueChange={handleAmPmInChange} />
          </div>

          {/* Check-out Time Input */}
          <div className="grid gap-1 py-1">
            <label className="text-sm">Check-out Time:</label>
            <input
         
         type="time"
              value={outTime}
              onChange={handleOutTimeChange}
              className="w-[100%] bg-bg_primary border-[1px] border-secondary py-1 px-1 rounded-md"
            />
            <SelectAmPm value={amPmOut} onValueChange={handleAmPmOutChange} />
          </div>

          {/* Shift Type and Nature of Time Selects */}
          <label className="text-sm">Shift Type:</label>
          <Select
            value={selectedShiftType}
            onValueChange={(value) => setSelectedShiftType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Shift Type" />
            </SelectTrigger>
            <SelectContent>
              {shifts.map((shift) => (
                <SelectItem key={shift.id} value={shift.id}>
                  {shift.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="text-sm">Nature of Time:</label>
          <Select
            value={selectedNatureOfType}
            onValueChange={(value) => setSelectedNatureOfType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Nature of Time" />
            </SelectTrigger>
            <SelectContent>
              {natureOfTimes.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Footer with Save Button */}
        <DialogFooter>
          <button
            type="button"
            className="bg-primary text-white rounded-md p-2"
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Save Changes"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EmployeeEditModal;
