export const dynamic = "force-dynamic";

import { NextResponse, NextRequest } from "next/server";

import { MongoClient } from "mongodb";

import { decodeToken } from "@/lib/decode-token";
import { formatDateToMMDD, getDateTimeRangeQuery } from "@/utils/time";

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

      const attendanceCollection = mongoClient
        .db(process.env.DB_NAME)
        .collection("attendances");

      const companyId: string = (decoded.companyId ?? decoded._id) as string;

      const fromDate = req.nextUrl.searchParams.get("from") as string;
      const toDate = req.nextUrl.searchParams.get("to") as string;

      let query: Record<string, any> = {
        companyId,
        ...getDateTimeRangeQuery("date-range", {
          from: fromDate,
          to: toDate,
        }),
      };

      const attendances = await attendanceCollection
        .aggregate([
          {
            $match: query,
          },
          {
            $facet: {
              data: [
                {
                  $project: {
                    status: 1,
                    employeeId: 1,
                    checkInTime: 1,
                  },
                },
                {
                  $lookup: {
                    from: "employees",
                    let: { employeeId: { $toObjectId: "$employeeId" } },
                    pipeline: [
                      { $match: { $expr: { $eq: ["$_id", "$$employeeId"] } } },
                      {
                        $project: {
                          employeeName: 1,
                          employeeNumber: 1,
                          _id: 0,
                        },
                      },
                    ],
                    as: "employeeInfo",
                  },
                },
                {
                  $unwind: {
                    path: "$employeeInfo",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: [
                        "$employeeInfo",
                        {
                          checkInTime: "$checkInTime",
                          status: "$status",
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        ])
        .toArray();

      if (Array.isArray(attendances) && attendances.length > 0) {
        const summary: Record<string, any> = {};

        attendances[0].data.forEach((attendance: any) => {
          const formattedDate = formatDateToMMDD(attendance.checkInTime);

          if (!summary[attendance.employeeName]) {
            summary[attendance.employeeName] = {
              employeeName: attendance.employeeName,
              employeeNumber: attendance.employeeNumber,
              summary: [
                {
                  date: formattedDate,
                  status: attendance.status,
                },
              ],
            };
          } else {
            summary[attendance.employeeName].summary.push({
              date: formattedDate,
              status: attendance.status,
            });
          }
        });

        return NextResponse.json({ status: "success", data: summary });
      } else {
        return NextResponse.json(
          { error: "No attendances found" },
          {
            status: 404,
          }
        );
      }
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
