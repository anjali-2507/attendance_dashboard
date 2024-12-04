import React from "react";

import Link from "next/link";

import SidebarItem from "./SidebarItem";

import { MessageSquareShare, Menu } from "lucide-react";

function Sidebar() {
  return (
    <aside className="md:absolute bg-bg_primary md:h-dvh md:flex-col border-r-[1px] border-zinc-300">
      <div className="relative max-md:h-[32px] border-secondary/[0.5] max-md:border-b-[1px]">
        <div>
          <Menu className="md:hidden m-1 cursor-pointer"/>
        </div>
        <nav className="max-md:hidden flex flex-col items-center gap-4 px-2 sm:py-4">
          <Link
            href="#"
            className="max-md:hidden group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <MessageSquareShare className="h-[22px] w-[22px] transition-all group-hover:scale-110" />
            <span className="sr-only">AutoWhat</span>
          </Link>

          <SidebarItem />
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
