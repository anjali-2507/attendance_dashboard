export const dynamic = "force-dynamic";

import { NextResponse, NextRequest } from "next/server";

import { MongoClient } from "mongodb";

import { decodeToken } from "@/lib/decode-token";

import { getDateTimeRangeQuery, getStartOrEndDate } from "@/utils/time";

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

      const offset = req.nextUrl.searchParams.get("offset");
      const type = req.nextUrl.searchParams.get("type") as string;

      const attendanceCollection = mongoClient
        .db(process.env.DB_NAME)
        .collection("attendances");

      const companyId: string = (decoded.companyId ?? decoded._id) as string;

      let query: Record<string, any> = {
        companyId,
        date: getDateTimeRangeQuery(type),
      };

      const attendances = await attendanceCollection
        .aggregate([
          {
            $match: query,
          },
          {
            $facet: {
              metadata: [{ $count: "total" }],
              data: [
                {
                  $skip: Number(offset),
                },
                {
                  $limit: 10,
                },
                {
                  $project: {
                    employeeId: 1,
                    checkInTime: 1,
                    date: 1,
                    checkInPic: 1,
                    status: 1,
                    timeSpent: 1,
                    _id: 1,
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
                          checkIn: 1,
                          role: 1,
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
                          date: "$date",
                          checkInPic: "$checkInPic",
                          checkInCoords: "$checkInCoords",
                          status: "$status",
                          timeSpent: "$timeSpent",
                          id: "$_id",
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            $unwind: "$metadata",
          },
        ])
        .toArray();
      console.log(attendances)
      if (Array.isArray(attendances) && attendances.length > 0) {
        const total = attendances[0].metadata.total;
        const data = attendances[0].data;

        return NextResponse.json({ status: "success", data, total });
      } else {
        return NextResponse.json(
          { error: "No attendances found" },
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
