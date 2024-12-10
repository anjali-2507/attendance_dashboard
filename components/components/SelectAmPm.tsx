import React from "react";
import classNames from "classnames";

// Updating prop names to match the existing usage in EmployeeEditModal
interface SelectAmPmProps {
  value: string; // renamed from 'amPm'
  onValueChange: (value: string) => void; // renamed from 'handleAmPm'
}

function SelectAmPm({ value, onValueChange }: SelectAmPmProps) {
  return (
    <div className="absolute top-[5px] right-2 text-white text-sm flex gap-x-1">
      <div
        className={classNames({
          "py-[2px] px-2 rounded-md cursor-pointer": true,
          "bg-[#CA8787]": value === "pm", // renamed amPm to value
          "bg-[#CA8787]/[0.35]": value !== "pm", // renamed amPm to value
        })}
        onClick={() => onValueChange("pm")} // renamed handleAmPm to onValueChange
      >
        PM
      </div>
      <div
        className={classNames({
          "py-[2px] px-2 rounded-md cursor-pointer": true,
          "bg-[#CA8787]": value === "am", // renamed amPm to value
          "bg-[#CA8787]/[0.35]": value !== "am", // renamed amPm to value
        })}
        onClick={() => onValueChange("am")} // renamed handleAmPm to onValueChange
      >
        AM
      </div>
    </div>
  );
}

export default SelectAmPm;
