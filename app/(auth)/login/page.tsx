"use client";

import React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Alert from "@/components/Alert";
import Loading from "@/components/Loading";

const formSchema = z.object({
  phone_number: z.number(),
});

export default function page() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = React.useState(0);
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone_number: phoneNumber,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/gen-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone: Number(`91${phoneNumber}`) }),
        }
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();

      if (!data.status) {
        throw new Error("Invalid OTP");
      }

      router.push(`/login/input-otp?number=${Number(`91${phoneNumber}`)}`);
    } catch (err) {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-[#DEF9C4]/[.65] flex h-full items-center justify-center p-4 lg:p-8">
      <div
        className={`mx-auto w-full flex-col justify-center space-y-6 sm:w-[400px] ${
          isLoading ? "hidden" : "flex"
        }`}
      >
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <p className="text-md font-medium text-muted-foreground">
            Enter your phone number below to login to your account
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Phone Number</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="w-[50px] bg-transparent border-b-[2px] border-black p-2 block text-md">
                        +91
                      </div>
                      <input
                        placeholder="Enter Phone Number"
                        type="number"
                        className="bg-transparent outline-none w-[100%] border-b-[2px] border-black py-2 block text-md"
                        onChange={(e) => setPhoneNumber(Number(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-[100%] py-2 block bg-[#508D4E]">
              Send OTP
            </Button>
          </form>
        </Form>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <Alert
        title={
          "Failed to send otp"
        }
        isVisible={isError}
      />

      <Loading isVisible={isLoading} />
    </div>
  );
}
