"use client";

import React from "react";
import { Suspense } from "react";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

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
import {
  InputOTP,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import Alert from "@/components/Alert";
import Loading from "@/components/Loading";

import { updateUser } from "@/redux/features/user-slice";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

function PhoneSearchParams({ setPhoneNumber }: { setPhoneNumber: any }) {
  const searchParams = useSearchParams();

  const phoneNumber = searchParams.get("number");

  React.useEffect(() => {
    setPhoneNumber(phoneNumber);
  }, []);

  return <></>;
}

export default function InputOTPForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [phoneNumber, setPhoneNumber] = React.useState<number | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: data.pin,
            phone: phoneNumber,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (result.success) {
        dispatch(updateUser({}));
        router.push(`/home`);
      } else {
        throw new Error(result.message || "OTP verification failed");
      }
    } catch (error) {
      setIsError(true);
      setIsLoading(false)
      setTimeout(() => setIsError(false), 5000);
    } 
  }

  return (
    <>
      <Suspense>
        <PhoneSearchParams setPhoneNumber={setPhoneNumber} />
      </Suspense>
      <div className="bg-[#DEF9C4]/[.65] flex h-full justify-center items-center p-4 lg:p-8">
        <div className={`${isLoading ? "hidden" : "flex"}`}>
          <div className="mx-auto w-full flex-col justify-center space-y-6 sm:w-[400px] flex">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-[100%] space-y-4"
              >
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <div className="w-[100%] flex justify-between items-center">
                            <InputOTPSlot
                              index={0}
                              className="border-[1px] border-gray-400 w-[50px] outline-[#DEF9C4] outline-1"
                            />
                            <InputOTPSlot
                              index={1}
                              className="border-[1px] border-gray-400 w-[50px] outline-[#DEF9C4] outline-1"
                            />
                            <InputOTPSlot
                              index={2}
                              className="border-[1px] border-gray-400 w-[50px] outline-[#DEF9C4] outline-1"
                            />
                            <InputOTPSeparator />
                            <InputOTPSlot
                              index={3}
                              className="border-[1px] border-gray-400 w-[50px] outline-[#DEF9C4] outline-1"
                            />
                            <InputOTPSlot
                              index={4}
                              className="border-[1px] border-gray-400 w-[50px] outline-[#DEF9C4] outline-1"
                            />
                            <InputOTPSlot
                              index={5}
                              className="border-[1px] border-gray-400 w-[50px] outline-[#DEF9C4] outline-1"
                            />
                          </div>
                        </InputOTP>
                      </FormControl>
                      <FormDescription>
                        Please enter the one-time password sent to your phone.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-[100%] py-2 block bg-[#508D4E]"
                >
                  Submit
                </Button>
              </form>
            </Form>

            <div className="flex justify-center flex-col items-center">
              <p className="text-sm ">Didn't Receive any code?</p>
              <p
                className="text-[#508D4E]/[0.5] text-[14px] hover:text-[#508D4E] cursor-pointer"
                onClick={() => ""}
              >
                Resend New Code
              </p>
            </div>
          </div>

          <Alert
            title={
              "The OTP is invalid or has expired. Please enter a valid code or request a new one."
            }
            isVisible={isError}
          />
        </div>
        
        <Loading isVisible={isLoading} />
      </div>
    </>
  );
}
