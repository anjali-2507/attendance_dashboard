import { decodeToken } from "@/lib/decode-token";
import { MongoClient, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req:NextRequest, res:NextResponse){
    let mongoClient;
    try {
        console.log("inside")
        const decode = await decodeToken(req);
        if(!decode){
            return NextResponse.redirect(`${process.env.SERVER_URL}/login`)
        }
        const data = await req.json();
        const [inHours, inMinutes, inSeconds] = data.inTime.split(":")
        const [outHours, outMinutes, outSeconds] = data.outTime.split(":")

        const checkInTime = new Date(data.checkInTime);
        checkInTime.setHours(inHours)
        checkInTime.setMinutes(inMinutes)
        checkInTime.setSeconds(inSeconds)

        const checkOutTime = new Date(data.checkOutTime);
        checkOutTime.setHours(outHours)
        checkOutTime.setMinutes(outMinutes)
        checkOutTime.setSeconds(outSeconds)

        console.log(data)
        //Establishing Mongo Connection
        mongoClient = new MongoClient(process.env.MONGODB_URI as string);
        await mongoClient.connect();
        if(mongoClient){
            console.log("MongoClient success")
        }
        //connecting with specific collection
        const employeeCollection = mongoClient
        .db(process.env.DB_NAME)
        .collection("employees");

        if(employeeCollection){
            console.log("empl collection success")
        }

        const updateRes = await employeeCollection.updateOne(
            {_id: new ObjectId(data.employeeId)},
            {$set:{checkInTime,
                checkOutTime,
                employeeName:data.employeeName,
                employeeNumber:parseInt(data.employeeNumber),
                shiftType:data.shiftType,
                bufferTime:data.bufferTime,
                natureOfTime: data.natureOfTime,
            } }
        );
        
        if(updateRes){
            console.log("upadeREs success")
        }else{
            console.log("upadeREs failed")
        }

        if(!updateRes){
            return NextResponse.json(
                { error: "Failed to update attendance" },
                { status: 500 }
              );
        }
        console.log(updateRes)
        return NextResponse.json({ status: "success",data:{checkInTime,
            checkOutTime,
            employeeName:data.employeeName,
            employeeNumber:parseInt(data.employeeNumber),
            shiftType:data.shiftType,
            bufferTime:data.bufferTime,
            natureOfTime: data.natureOfTime,} },{status:200});
        
    } catch (err) {
        console.error("Error: ",err);
        return NextResponse.json(
          { error: "internal server error" },
          { status: 500 }
        );
    }
    finally {
        if (mongoClient) {
          await mongoClient.close();
        }
    }
}