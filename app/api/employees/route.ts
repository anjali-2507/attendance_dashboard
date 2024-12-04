import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// This function will handle adding a new employee to the database.
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse the request body
    const {
      employeeName,
      employeeNumber,
      employerNumber,
      checkIn,
      natureOfTime,
      role,
      shiftType,
    } = body;

    console.log(body);

    // Validate incoming data
    if (
      !employeeName ||
      !employeeNumber ||
      !checkIn ||
      !role ||
      !shiftType
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // MongoDB connection setup
    const mongoClient = new MongoClient(process.env.MONGODB_URI as string);
    await mongoClient.connect();

    const db = mongoClient.db(process.env.DB_NAME);
    const employeesCollection = db.collection("employees");
    const employersCollection = db.collection("employers");

    // Fetch employer details
    const employer = await employersCollection.findOne(
      { employerNumber },
      { projection: { _id: 1, companyName: 1 } }
    );

    // Validate employer existence
    if (!employer) {
      await mongoClient.close();
      return NextResponse.json(
        { error: "Employer not found" },
        { status: 404 }
      );
    }

    // Construct new employee object
    const newEmployee = {
      employeeName,
      employeeNumber,
      employerNumber,
      checkIn: new Date(checkIn), // Convert directly to Date object
      natureOfTime,
      role,
      shiftType,
      createdAt: new Date(),
      companyId: employer._id.toString(),
      companyName: employer.companyName,
      isActive: true, // Default values as shown in example
      rights: [],
      workDays: [],
      proof: {},
      locations: [],
      language: "English",
      countryName: "India",
      countryCode: "IN",
      timeZone: "Asia/Kolkata",
      regionName: "Gujarāt",
    };

    // Insert the new employee into the collection
    await employeesCollection.insertOne(newEmployee);

    // Close the MongoDB connection
    await mongoClient.close();

    return NextResponse.json(
      { message: "Employee added successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// New DELETE route to delete an employee by employeeNumber
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeNumber = searchParams.get("employeeNumber"); // Fetch employeeNumber from query parameters

    if (!employeeNumber) {
      return NextResponse.json(
        { error: "Employee number is required" },
        { status: 400 }
      );
    }

    // MongoDB connection setup
    const mongoClient = new MongoClient(process.env.MONGODB_URI as string);
    await mongoClient.connect();

    const db = mongoClient.db(process.env.DB_NAME);
    const employeesCollection = db.collection("employees");

    // Delete the employee document from the collection
    const result = await employeesCollection.deleteOne({ employeeNumber });

    // Close the MongoDB connection
    await mongoClient.close();

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// New GET route to fetch employee data with formatted check-in time
export async function GET(req: NextRequest) {
  try {
    // MongoDB connection setup
    const mongoClient = new MongoClient(process.env.MONGODB_URI as string);
    await mongoClient.connect();

    const db = mongoClient.db(process.env.DB_NAME);
    const employeesCollection = db.collection("employees");

    // Fetch employee data
    const employees = await employeesCollection.find().toArray();

    // Format the checkIn time for display (assuming you want it in a readable format)
    const formattedEmployees = employees.map((employee) => {
      // Format check-in time to a readable string
      const checkInTimeFormatted = employee.checkIn instanceof Date
        ? new Date(employee.checkIn).toLocaleString("en-IN", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })
        : employee.checkIn;

      return {
        ...employee,
        checkIn: checkInTimeFormatted, // Format check-in time
      };
    });

    // Close the MongoDB connection
    await mongoClient.close();

    return NextResponse.json(formattedEmployees, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

