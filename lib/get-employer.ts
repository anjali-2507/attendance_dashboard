export const getEmployer = async (phone: number, client: any) => {
  const employerCollection = client
    .db(process.env.DB_NAME)
    .collection("employers");

  return await employerCollection.findOne(
    {
      employerNumber: phone,
    },
    { projection: { employerNumber: 1, fullName: 1, role: 1 } }
  );

  // if (employer) {
  //   return NextResponse.json(
  //     {
  //       status: true,
  //       data: {
  //         name: employer.employerName,
  //         number: employer.employeeNumber,
  //         role: employer.role,
  //       },
  //     },
  //     {
  //       status: 200,
  //     }
  //   );
  // }
};
