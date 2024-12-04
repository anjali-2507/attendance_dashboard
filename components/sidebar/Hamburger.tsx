"use client";

import React from "react";

import classNames from "classnames";

import { Menu } from "lucide-react";

import { useDispatch } from "react-redux";

import { useAppSelector } from "@/redux/store";

import { toggle } from "@/redux/features/toggle-slice";

function Hamburger() {
  const dispatch = useDispatch();

  const sidebarToggle = useAppSelector((state) => state.sidebarToggle.value);

  const handleToggle = () => {
    dispatch(toggle());
  };

  return (
    <div>
      <Menu
        className={classNames({
          "md:hidden m-1 cursor-pointer": true,
        })}
        onClick={handleToggle}
      />
    </div>
  );
}

export default Hamburger;
