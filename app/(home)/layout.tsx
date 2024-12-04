import React from "react";

import Sidebar2 from "@/components/sidebar/Sidebar";

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-bg_primary">
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar2 />
        <main className="md:ml-16 pr-2 mt-2 max-md:px-2">{children}</main>
      </div>
    </div>
  );
};

export default HomeLayout;
