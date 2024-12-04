import { NextResponse, NextRequest } from "next/server";

import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

import { cookies } from "next/headers";

import { signToken, USER_TOKEN } from "@/utils/jwt";

// import { setUserCookie } from "@/utils/jwt";

// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";

// const rateLimiter = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(2, "3 s"),
// });

export async function POST(req: NextRequest, res: NextResponse) {
  // const user_ip = req.headers.get("x-forwarded-for") as string;

  //   const { success } = await rateLimiter.limit(user_ip);

  //   if (!success) {
  //     // return res.status(429).json({ error: "Too Many Requests" });
  //     return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  //   }

  const mongoClient = new MongoClient(process.env.MONGODB_URI as string);
  await mongoClient.connect();
  const otps = mongoClient.db(process.env.DB_NAME).collection("otps");

  try {
    const body = await req.json();
    const phone = Number(body?.phone);
    // Fetch the OTP record from the database
    const otpRecord = await otps
      .aggregate([
        {
          $match: {
            phone,
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
        {
          $limit: 1,
        },
      ])
      .toArray();
    console.log(otpRecord)
    if (!otpRecord || otpRecord.length === 0) {
      return NextResponse.json(
        { error: "Invalid phone number or OTP" },
        { status: 400 }
      );
    }

    // Check if the OTP has expired
    if (Date.now() > otpRecord[0].expiry) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Check if the OTPs match
    const otpMatch = await bcrypt.compare(
      body.otp.toString(),
      otpRecord[0].otp
    );

    if (!otpMatch) {
      return NextResponse.json(
        { error: "Invalid phone number or OTP" },
        { status: 400 }
      );
    }

    let token: string = "";

    const employeeCollection = mongoClient
      .db(process.env.DB_NAME)
      .collection("employees");

    const employee = await employeeCollection.findOne(
      {
        employeeNumber: phone,
      },
      { projection: { employeeName: 1, role: 1, employeeNumber: 1, _id: 1 } }
    );

    if (employee) {
      token = await signToken({
        name: employee.employeeName,
        phone: employee.employeeNumber,
        role: employee.role,
        _id: employee._id
      });


      // setUserCookie(res, {
      //   name: employee.employeeName,
      //   phone: employee.employeeNumber,
      //   role: employee.role,
      //   _id: employee._id,
      // });

      const dbRes = await otps.deleteMany({ phone });

      // Set JWT token in the cookies
      cookies().set(USER_TOKEN, token, {
        httpOnly: true,
        secure: true,
        // secure: false process.env.NODE_ENV !== "development",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: "lax",
        path: "/",
      });

      // Respond with a success status
      return NextResponse.json(
        { success: true, data: { name: employee.employeeName,
          phone: employee.employeeNumber,
          role: employee.role,
          _id: employee._id } },
        { status: 200, headers: {} }
      );
    }

    const employerCollection = mongoClient
      .db(process.env.DB_NAME)
      .collection("employers");

    const employer = await employerCollection.findOne(
      {
        employerNumber: phone,
      },
      {
        projection: {
          fullName: 1,
          role: 1,
          employerNumber: 1,
          _id: 1,
          companyId: 1,
        },
      }
    );

    if (employer) {
      // setUserCookie(res, {
      //   name: employer.fullName,
      //   phone: employer.employerNumber,
      //   role: employer.role,
      //   _id: employer._id,
      //   companyId: employer.companyId,
      // });

      token = await signToken({
        name: employer.fullName,
        phone: employer.employerNumber,
        role: employer.role,
        _id: employer._id,
        companyId: employer.companyId
      });

      // OTP is valid and has not expired, so we can delete it now
      const dbRes = await otps.deleteMany({ phone });

      // Set JWT token in the cookies
      cookies().set(USER_TOKEN, token, {
        httpOnly: true,
        secure: true,
        // secure: false process.env.NODE_ENV !== "development",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: "lax",
        path: "/",
      });

      // Respond with a success status
      return NextResponse.json(
        { success: true, data: { name: employer.fullName,
          phone: employer.employerNumber,
          role: employer.role,
          _id: employer._id,
          companyId: employer.companyId  } },
        { status: 200, headers: {} }
      );
    } else {
      console.log("employee Not found")
      return NextResponse.json(
        { success: false, message: "user not found" },
        { status: 404 }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not verify OTP" },
      { status: 500 }
    );
  } finally {
    await mongoClient.close();
  }
}
