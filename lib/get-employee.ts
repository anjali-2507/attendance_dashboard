import { ObjectId } from "mongodb";

export const getEmployee = async (phone: number, client: any) => {
  const employeeCollection = client
    .db(process.env.DB_NAME)
    .collection("employees");

  return await employeeCollection.findOne(
    {
      employeeNumber: phone,
    },
    { projection: { employeeNumber: 1, employeeName: 1, role: 1 } }
  );
};

export const getEmployees = async (id: string, client: any) => {
  const employeeCollection = client
    .db(process.env.DB_NAME)
    .collection("employees");

  return await employeeCollection.find(
    {
      companyId: id,
    },
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
        shiftType: 1
      },
    }
  ).toArray();
};
