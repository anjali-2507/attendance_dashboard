import React from "react";

import classNames from "classnames";

interface SelectAmPmProps {
  amPm: string;
  handleAmPm: (amPm: string) => void;
}

function SelectAmPm({ amPm, handleAmPm }: SelectAmPmProps) {
  return (
    <div className="absolute top-[5px] right-2 text-white text-sm flex gap-x-1">
      <div
        className={classNames({
          "py-[2px] px-2 rounded-md cursor-pointer": true,
          "bg-[#CA8787]": amPm === "pm",
          "bg-[#CA8787]/[0.35]": amPm !== "pm",
        })}
        onClick={() => handleAmPm("pm")}
      >
        PM
      </div>
      <div
        className={classNames({
          "py-[2px] px-2 rounded-md cursor-pointer": true,
          "bg-[#CA8787]": amPm === "am",
          "bg-[#CA8787]/[0.35]": amPm !== "am",
        })}
            onClick={() => handleAmPm("am")}
      >
        AM
      </div>
    </div>
  );
}

export default SelectAmPm;
