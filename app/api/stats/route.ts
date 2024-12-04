import { NextResponse, NextRequest } from "next/server";

import { MongoClient } from "mongodb";

import { decodeToken } from "@/lib/decode-token";

export async function GET(req: NextRequest, res: NextResponse) {
  const decoded: any = await decodeToken(req);

  if (decoded === false) {
    return NextResponse.redirect(`${process.env.SERVER_URL}/login`);
  }

  let mongoClient;

  try {
    mongoClient = new MongoClient(process.env.MONGODB_URI as string);
    await mongoClient.connect();

    const employeeCollection = mongoClient
      .db(process.env.DB_NAME)
      .collection("employees");

    const employee = await employeeCollection.findOne(
      {
        employeeNumber: decoded.phone,
      },
      { projection: { _id: 1, employeeName: 1, employeeNumber: 1, role: 1 } }
    );

    if (employee) {
      return NextResponse.json(
        {
          status: true,
          data: {
            name: employee.employeeName,
          phone: employee.employeeNumber,
          role: employee.role,
          _id: employee._id
          },
        },
        {
          status: 200,
        }
      );
    }

    const employerCollection = mongoClient
      .db(process.env.DB_NAME)
      .collection("employers");

    const employer = await employerCollection.findOne(
      {
        employerNumber: decoded.phone,
      },
      {
        projection: {
          _id: 1,
          fullName: 1,
          employerNumber: 1,
          role: 1,
          companyId: 1,
        },
      }
    );

    if (employer) {
      const employeeCollection = mongoClient
        .db(process.env.DB_NAME)
        .collection("employees");

      const employees = await employeeCollection.countDocuments({
        $or: [
          { companyId: employer._id.toString() },
          { companyId: employer.companyId },
        ],
      });

      const currentDate = new Date();
      const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

      const pipeline = [
        {
          $match: {
            $or: [
              { companyId: employer._id.toString() },
              { companyId: employer.companyId },
            ],
            status: { $in: ["onTime", "full-day", "half-day", "late"] },
            checkInTime: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $group: {
            _id: "$employeeId",
            statusCounts: {
              $push: "$status",
            },
          },
        },
      ];

      const attendances = await mongoClient
        .db(process.env.DB_NAME)
        .collection("attendances")
        .aggregate(pipeline)
        .toArray();

      if (attendances && attendances.length > 0) {
        const presentCount = new Set(
          attendances.map((attendance) => attendance._id)
        ).size;

        const absentCount = employees - presentCount;

        const counts: Record<string, number> = {
          onTime: 0,
          late: 0,
          "full-day": 0,
          "half-day": 0,
        };

        attendances.forEach((attendance) => {
          counts[attendance.statusCounts[0]]++;
        });

        return NextResponse.json(
          {
            status: "success",
            data: {
              summary: {
                totalEmployees: employees,
                presentCount,
                absentCount,
                fullDayCount: counts["full-day"],
                halfDayCount: counts["half-day"],
                onTimeCount: counts["onTime"],
                lateCount: counts["late"],
              },
              user: {
                name: employer.employeeName,
                phone: employer.employeeNumber,
                role: employer.role,
                companyId: employer._id.toString()
              },
            },
          },
          {
            status: 200,
          }
        );
      } else {
        return NextResponse.json(
          {
            status: "success",
            data: {
              employees,
              name: employer.fullName,
              role: employer.role,
              phone: employer.employerNumber,
            },
          },
          {
            status: 200,
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
      { error: "internal server erro" },
      {
        status: 500,
      }
    );
  }
}
