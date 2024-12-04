export const dynamic = "force-dynamic";

import { NextResponse, NextRequest } from "next/server";

import { MongoClient } from "mongodb";

import { getEmployees } from "@/lib/get-employee";

import { decodeToken } from "@/lib/decode-token";

export async function GET(req: NextRequest) {
  try {
    const decoded: any = await decodeToken(req);

    if (decoded === false) {
      return NextResponse.redirect(`${process.env.SERVER_URL}/login`);
    }

    if (decoded.role === "employer" || decoded.role === "admin") {
      let mongoClient;

      mongoClient = new MongoClient(process.env.MONGODB_URI as string);
      await mongoClient.connect();

      const companyId: string = (decoded.companyId && decoded.companyId !== '' ? decoded.companyId : decoded._id) as string;

      const offset = req.nextUrl.searchParams.get("offset");

      const employeeCollection = mongoClient
        .db(process.env.DB_NAME)
        .collection("employees");

      const employees = await employeeCollection
        .find(
          { companyId},
          {
            projection: {
              _id: 1,
              employeeNumber: 1,
              employeeName: 1,
              role: 1,
              checkIn: 1,
              checkOut: 1,
              requiredHours: 1,
              natureOfTime: 1,
              timeZone: 1,
              shiftType: 1,
              count: 1,
              bufferTime:1,
              companyId: 1,
            },
          }
        )
        .skip(Number(offset))
        .limit(10)
        .toArray();

        const total = await employeeCollection.countDocuments({ companyId })

      if (Array.isArray(employees) && employees.length > 0) {
        return NextResponse.json({
          status: "success",
          data: employees,
          total,
        }, { });
      } else {
        return NextResponse.json(
          { error: "No employees found" },
          {
            status: 404,
          }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Unauthorized" },
        {
          status: 401,
        }
      );
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "internal server error" },
      {
        status: 500,
      }
    );
  }
}
