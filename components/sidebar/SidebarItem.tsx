"use client";

import React from "react";

import { usePathname } from "next/navigation";

import Link from "next/link";

import classNames from "classnames";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { LogOut, Home, Users2, CalendarCheck } from "lucide-react";

import { useDispatch } from "react-redux";

import { useAppSelector } from "@/redux/store";
import { updateUser } from "@/redux/features/user-slice";

import { getUser } from "@/lib/get-user";

function SidebarItem() {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const user = useAppSelector((state) => state.user.value);

  const sideBarItems = React.useMemo(() => {
    let items = [
      {
        label: "Overview",
        icon: (
          <Home className="h-[22px] w-[22px] transition-all group-hover:scale-110" />
        ),
        link: "/home",
      },
      {
        label: "Attendance",
        icon: (
          <CalendarCheck className="h-[22px] w-[22px] transition-all group-hover:scale-110" />
        ),
        link: "/attendance",
      },
      {
        label: "Logout",
        icon: (
          <LogOut className="h-[22px] w-[22px] transition-all group-hover:scale-110" />
        ),
        link: "/logout",
      },
    ];

    if (user?.role === "employer" || user?.role === "admin") {
      items = [
        ...items.slice(0, 2),
        {
          label: "Employees",
          icon: (
            <Users2 className="h-[22px] w-[22px] transition-all group-hover:scale-110" />
          ),
          link: "/employee",
        },
        ...items.slice(2),
      ];
    }

    return items;
  }, [user]);

  const activePath = React.useMemo(
    () => `/${pathname.split("/")[1]}`,
    [pathname]
  );

  React.useLayoutEffect(() => {
    if (!user) {
      const getUserData = async () => {
        const userData = await getUser();

        dispatch(updateUser(userData));
      };

      getUserData();
    }
  }, []);

  return (
    <div
      className={classNames({
        "max-md:hidden": true,
      })}
    >
      {sideBarItems.map((item) => (
        <TooltipProvider key={item.label}>
          <Tooltip>
            <TooltipTrigger
              asChild
              className={classNames({
                "bg-accent": activePath === item.link,
                "first:mt-0 mt-2": true,
              })}
            >
              <Link
                href={item.link}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                {item.icon}
                <span className="sr-only">{item.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}

export default SidebarItem;
