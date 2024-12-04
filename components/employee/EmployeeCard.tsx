import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"


export type employeeDataProps={
checkInTime: any;
  id: string | undefined;
  employeeName: string |undefined;
  employeeNumber: number | undefined;
  checkOutTime: any;
  shiftType: string | undefined;
  natureOfTime: string | undefined;
  bufferTime: string | undefined;
}
const EmployeeCard = ({id,employeeName,employeeNumber,checkInTime,checkOutTime,shiftType,natureOfTime,bufferTime}:employeeDataProps) => {
  const formattedCheckInTime = new Date(checkInTime)
    .toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .split(" ");
  const formattedCheckOutTime = new Date(checkOutTime)
    .toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .split(" ");
  return (
    <div>
      <Card className='mt-3 text-sm'>
        <CardHeader>
          <div className='text-xl font-bold'>Employee Details</div>
        <Separator />
        </CardHeader>
        <CardContent>
          
          <Table>
            {/* <TableHeader>
              <TableRow aria-colspan={2}>
                <TableHead>Employee Data</TableHead>
                
              </TableRow>
            </TableHeader> */}
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{employeeName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Contact</TableCell>
                <TableCell>{`+${employeeNumber?.toString().slice(0,2)}-${employeeNumber?.toString().slice(2)}`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>CheckIn</TableCell>
                <TableCell>{formattedCheckInTime[0]}:{formattedCheckInTime[1]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>CheckOut</TableCell>
                <TableCell>{formattedCheckOutTime[0]}:{formattedCheckOutTime[1]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Buffer Tiime</TableCell>
                <TableCell>{bufferTime}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Shift type</TableCell>
                <TableCell>{shiftType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Nature of Time</TableCell>
                <TableCell>{natureOfTime}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  )
}

export default EmployeeCard
