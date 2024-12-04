"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux"

import { updateUser } from "@/redux/features/user-slice";
import { getUser } from "@/lib/get-user";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const getUserData = async () => {
      const data = await getUser();

      if (data) {
        dispatch(updateUser(data));
        router.push("/home");
      } else {
        router.push("/login");
      }
    };

    getUserData();
  }, []);

  return <></>;
}
