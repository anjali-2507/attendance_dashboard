"use client";

import React from "react";

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

interface EditAttendanceProps {
  checkInTime: any;
  status: string | null;
  id: string | null;
}

function EditAttendance({ checkInTime, status, id }: EditAttendanceProps) {
  const formattedCheckInTime = new Date(checkInTime)
    .toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .split(" ");

  const [time, setTime] = React.useState(formattedCheckInTime[0]);

  const [amPm, setAmPm] = React.useState(formattedCheckInTime[1]);
  const [selectedStatus, setSelectedStatus] = React.useState(status);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTime = event.target.value;

    // Extract hours and minutes
    const [hours, minutes] = selectedTime.split(":").map(Number);

    // Check if hours are between 1 and 12
    if (hours >= 1 && hours <= 12) {
      setTime(selectedTime);
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

  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      const [hour, minute] = time.split(":");

      let updatedTime = time;

      if (amPm === "pm" && Number(hour) !== 12) {
        updatedTime = `${Number(hour) + 12}:${minute}`;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/update-attendance`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            time: `${updatedTime}:00`,
            checkInTime,
            status: selectedStatus,
            attendanceDocId: id,
          }),
        }
      );

      if (res.status === 200) {
        const data = await res.json();

        if (data.status === "success") {
          dispatch(
            updateAttendanceItem({
              checkInTime: data.data.checkInTime,
              status: selectedStatus,
              _id: id,
            })
          );

          toast({
            description: "Attendane updated successfully",
          });

          setIsModalOpen(false);

          return;
        }
      }

      throw new Error();
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to update attendace",
      });
    } finally {
      setIsModalOpen(false);
      setIsLoading(false);
    }
  };

  const handleAmPmChange = (amPm: string) => {
    setAmPm(amPm);
  };

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
            <DialogTitle>Edit Attendance</DialogTitle>
            <DialogDescription>Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="relative">
              <input
                type="time"
                value={time}
                className="w-[100%] bg-bg_primary border-[1px] border-secondary py-1 px-1 rounded-md cursor-pointer"
                onChange={handleChange}
              />
              <SelectAmPm amPm={amPm} handleAmPm={handleAmPmChange} />
            </div>
            <Select onValueChange={(value) => setSelectedStatus(value)}>
              <SelectTrigger className="w-[100%] border-[1px] border-secondary px-1 rounded-md outline-none">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-bg_primary">
                <SelectGroup>
                  {statuses.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.label}
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

export default EditAttendance;
