import React from "react";

import { Alert as Al, AlertTitle } from "@/components/ui/alert";

interface AlertProps {
  title: string;
  isVisible: boolean;
}

const Alert: React.FC<AlertProps> = ({ title, isVisible }) => {
  return (
    <Al
      className={`${
        isVisible
          ? "bottom-4 right-3 opacity-100"
          : "bottom-0 right-3 opacity-0"
      } absolute w-fit bg-red-500 text-white p-4 px-3 m-0 transition-all duration-500 linear`}
    >
      <AlertTitle className="font-semibold p-0 m-0">{title}</AlertTitle>
    </Al>
  );
};

export default Alert;
