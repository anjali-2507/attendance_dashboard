"use client";

import React from "react";

import { useDispatch } from "react-redux";
import { updateUser } from "@/redux/features/user-slice";

import { Badge } from "@/components/ui/badge";
interface GreetProps {
  name: string | undefined;
  role: string | undefined;
  phone: string | number | undefined;
}

const Greet: React.FC<GreetProps> = ({ name, role, phone }) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (name && role && phone) {
      dispatch(updateUser({ name, role, phone }));
    }
  }, [])

  return (
    <div>
      <p className="text-secondary mt-2">
        {getGreeting()},{" "}
        <span className="text-accent font-semibold">{name}</span>
      </p>
      <Badge className="bg-accent">{role}</Badge>

      <div className="mt-4">
        <p className="text-secondary">Today, <span className="text-accent font-semibold">{new Date().toLocaleDateString("en-GB", {dateStyle: "medium"})}</span></p>
      </div>
    </div>
  );
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 18) {
    return "Good afternoon";
  } else if (hour >= 18 || hour < 5) {
    return "Good evening";
  }
}

export default Greet;
