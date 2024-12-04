"use client";

import React from "react";

import classNames from "classnames";

import Loading from "../Loading";

interface TableProps {
  data: any;
  columns: any;
  height?: string;
  isLoading?: boolean;
  handleClick?: (row: any) => void;
}

function Table({ data, columns, handleClick, height, isLoading }: TableProps) {
  return (
    <div
      className={classNames({
        [height as string]: height,
        "h-400px": !height,
        "w-full overflow-y-scroll overflow-x-auto": true,
      })}
    >
      <table className="text-sm w-full border-collapse">
        <thead className="text-sm sticky top-0 z-20">
          <tr>
            {columns.map((column: any, i: number) => (
              <th
                key={i}
                className="bg-bg_primary border-zinc-300 text-md py-3 font-normal first:border-l first:rounded-tl-[4px] last:border-r last:rounded-tr-[4px] text-zinc-800 text-left border-y-[1px] z-20 whitespace-nowrap"
              >
                <p
                  className={classNames({
                    "pr-3 pl-2 border-l-2 ": i !== 0,
                    "px-3": i === 0,
                    "text-[12px] text-zinc-700 border-zinc-300": true,
                  })}
                >
                  {column.headerName}
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="border-[1px] border-zinc-300">
          {data &&
            data.map((row: any, i: number) => {
              return (
                <tr
                  key={i}
                  onClick={() => handleClick && handleClick(row)}
                  className={classNames({
                    "bg-bg_primary cursor-pointer hover:bg-[#F7DCB9]/[0.35]":
                      handleClick,
                  })}
                >
                  {columns.map((column: any, j: number) => (
                    <td
                      key={j}
                      className="font-normal text-md py-3 border-b-[1px] border-zinc-300 whitespace-nowrap"
                    >
                      <div className="pl-3 text-[12px] text-zinc-700">
                        {typeof column.getCellValue === "function"
                          ? column.getCellValue(column.field, row)
                          : row[column.field]}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
        </tbody>
      </table>

      {isLoading ? (
        <div className="w-[95vw] h-[400px] flex justify-center items-center">
          <Loading isVisible={isLoading} />
        </div>
      ) : (
        <></>
      )}

      {!isLoading && (data == null || data.length === 0) && (
        <div className="w-full text-zinc-700 text-center h-[300px] flex justify-center items-center">
          <p>No Data Available</p>
        </div>
      )}
    </div>
  );
}

const MemoizedTable = React.memo(Table);

MemoizedTable.displayName = "Table";

export default MemoizedTable;
