import { NextResponse, NextRequest } from "next/server";

import { decodeToken } from "@/lib/decode-token";

// export async function POST(req: NextRequest) {
//   let mongoClient;

//   try {
//     const body = await req.json();
//     const phone = body?.phone;

//     mongoClient = new MongoClient(process.env.MONGODB_URI as string);
//     await mongoClient.connect();

//     const employee = await getEmployee(phone, mongoClient);

//     if (employee) {
//       return NextResponse.json(
//         {
//           status: true,
//           data: {
//             name: employee.employeeName,
//             number: employee.employeeNumber,
//           },
//         },
//         {
//           status: 200,
//         }
//       );
//     }

//     const employer = await getEmployer(phone, mongoClient);

//     if (employer) {
//       return NextResponse.json(
//         {
//           status: true,
//           data: {
//             name: employer.employerName,
//             number: employer.employeeNumber,
//             role: employer.role,
//           },
//         },
//         {
//           status: 200,
//         }
//       );
//     }

//     return NextResponse.json(
//       { error: "No user found" },
//       {
//         status: 404,
//       }
//     );
//   } catch (err) {
//     console.error(err);

//     return NextResponse.json(
//       { error: "Failed to get user" },
//       {
//         status: 500,
//       }
//     );
//   } finally {
//     mongoClient?.close();
//   }
// }

export async function GET(req: NextRequest) {
  const decoded: any = await decodeToken(req);

  if (decoded === false) {
    return NextResponse.redirect(`${process.env.SERVER_URL}/login`);
  }

  const { name, phone, role } = decoded;

  return NextResponse.json(
    { status: "success", data: { name, phone, role } },
    { status: 200 }
  );
}
