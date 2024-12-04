"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { CalendarDays } from "lucide-react";

import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { PopoverClose } from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: DateRange | undefined
  handleDate: (from: any, to: any) => void;
}

export function DatePicker({ handleDate, date }: DatePickerProps) {

  const currentDate = new Date();

  const [pickerDate, setPickerDate] = useState<DateRange | undefined>({
    from: new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 3,
      currentDate.getDate()
    ),
    to: currentDate,
  });

  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger>
          <div
            id="date"
            className={cn(
              "w-[265px] border-gray-400 h-9 flex gap-x-2 items-center justify-start text-left font-normal cursor-pointer rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-w-sm",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarDays />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 inter-font" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            fromDate={pickerDate?.from}
            toDate={pickerDate?.to}
            selected={pickerDate}
            onSelect={setPickerDate}
            numberOfMonths={2}
            className="bg-bg_primary"
          />
          <PopoverClose className="w-[95%] bg-bg_primary">
            <div
              className="bg-accent text-white w-full h-9 px-4 py-1 m-3 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90"
              onClick={() => handleDate(pickerDate?.from, pickerDate?.to)}
            >
              View Report
            </div>
          </PopoverClose>
        </PopoverContent>
      </Popover>
    </div>
  );
}
