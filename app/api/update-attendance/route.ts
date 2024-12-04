import { NextResponse, NextRequest } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

import { decodeToken } from "@/lib/decode-token";

export async function PUT(req: NextRequest) {
  try {
    const decoded = await decodeToken(req);

    if (decoded === false) {
      return NextResponse.redirect(`${process.env.SERVER_URL}/login`);
    }

    const data = await req.json();

    const [hours, minutes, seconds] = data.time.split(":");

    const checkInTime = new Date(data.checkInTime);
    checkInTime.setHours(hours);
    checkInTime.setMinutes(minutes);
    checkInTime.setSeconds(seconds);

    const mongoClient = new MongoClient(process.env.MONGODB_URI as string);
    await mongoClient.connect();

    const attendanceCollection = mongoClient
      .db(process.env.DB_NAME)
      .collection("attendances");

    const updateRes = await attendanceCollection.updateOne(
      { _id: new ObjectId(data.attendanceDocId) },
      { $set: { checkInTime, status: data.status } }
    );

    if (updateRes.acknowledged && updateRes.modifiedCount > 0) {
      return NextResponse.json({ status: "success", data: { checkInTime } });
    }

    return NextResponse.json(
      { error: "Failed to update attendance" },
      { status: 500 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
