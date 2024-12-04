import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveReport from "./LiveReport";
import DateRangeReport from "./DateRangeReport";

function AttendanceTable() {
  const tabCls =
    "shadow-none rounded-none bg-bg_primary data-[state=active]:border-accent data-[state=active]:border-b-[1px] data-[state=active]:text-accent data-[state=active]:bg-bg_primary";

  return (
    <>
      <Tabs defaultValue="live" className="w-full">
        <TabsList className="bg-bg_primary mt-4">
          <TabsTrigger value="live" className={`${tabCls} w-[110px]`}>
            Live Report
          </TabsTrigger>
          <TabsTrigger value="date_range" className={`${tabCls} w-[150px]`}>
            Date Range Report
          </TabsTrigger>
        </TabsList>
        <TabsContent value="live" className="w-full">
          <LiveReport />
        </TabsContent>
        <TabsContent value="date_range">
          <DateRangeReport />
        </TabsContent>
      </Tabs>
    </>
  );
}

export default AttendanceTable;
