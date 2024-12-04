"use client";

import React from "react";

interface EmployeeFilterProps {
  handleSearch: (searchTerm: string) => void;
}

function EmployeeFilter({ handleSearch }: EmployeeFilterProps) {
  return (
    <div className=" py-3 my-4">
      <div className="">
        <input
          className="focus:border-accent bg-bg_primary py-1 px-2 outline-none w-[200px] border-b-[1px] border-secondary"
          placeholder="Search..."
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );
}

export default EmployeeFilter;
