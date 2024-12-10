"use client"; // Marking this as a Client Component
import React, { useState } from "react";
import EmployeeTable from "@/components/employee/EmployeeTable";
import Breadcrumbs from "@/components/components/Breadcrumbs";
import { useAppSelector } from "@/redux/store";
import { ComponentPlaceholderIcon } from "@radix-ui/react-icons";

// Define prop types for AddEmployeeForm
interface AddEmployeeFormProps {
  onClose: () => void; // onClose is a function with no arguments and no return value
}

// AddEmployeeForm component
function AddEmployeeForm({ onClose }: AddEmployeeFormProps) {
  const user = useAppSelector((state) => state.user.value);
  const [employeeName, setEmployeeName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bufferTime, setBufferTime] = useState("");
  const [workDay, setWorkDay] = useState("1"); // Default to "1"
  const [natureOfTime, setTimingType] = useState("Flexible"); // Default to "Flexible"
  const [role, setRole] = useState("");
  const [shiftType, setShiftType] = useState("Day"); // Default to "Day"
  const [locations, setLocation] = useState('');
  // Submit handler to call the backend API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    const formattedCheckIn = checkIn ? new Date(`1970-01-01T${checkIn}`).toISOString() : null;
    const formattedCheckOut = checkOut ? new Date(`1970-01-01T${checkOut}`).toISOString() : null;

    
    if (!formattedCheckIn || !formattedCheckOut) {
      alert("Please enter valid check-in and check-out times.");
      return;
    }
    const sanitizedPhoneNumber = phoneNumber.replace(/\D/g, "").slice(0, 10);
const formattedPhoneNumber = `+91${sanitizedPhoneNumber}`;

  
const employeeData = {
  employeeName,
  employeeNumber: formattedPhoneNumber, // Use formattedPhoneNumber here
  employerNumber: user?.number,
  checkIn: formattedCheckIn,
  checkOut: formattedCheckOut,
  bufferTime: Number(bufferTime), // Make sure it's a number
  workDays: workDay, // Correct this from 'workDay' to 'workDays'
  natureOfTime,
  role,
  shiftType,
  locations,
};

    
  
    console.log("Final employeeData payload:", employeeData);
  
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message || "Employee added successfully");
        onClose(); // Close the form after submission
      } else {
        const error = await response.json();
        console.error("API error:", error);
        alert(error.error || "Failed to add employee");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee Name</label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              placeholder="Enter name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-[-15px]">Phone Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value;
                // Sanitize the input (only allow numbers) and ensure the length is 10
                const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
                setPhoneNumber(sanitizedValue);
              }}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
              maxLength={10}
              placeholder="Enter number"
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-[-15px]">Check In Time</label>
            <input
              type="time"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-[-15px]">Check Out Time</label>
            <input
              type="time"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-[-15px]">Buffer Time (minutes)</label>
            <input
              type="number"
              value={bufferTime}
              onChange={(e) => setBufferTime(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              placeholder="Enter buffer time in minutes"
              required
            />
          </div>
          <div className="mt-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mt-[-15px]">Location</label>
          <input
          type="text"
          id="location"
          name="location"
          value={locations}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          placeholder="Enter location"
          required
       />
  </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-[-15px]">Work Day</label>
            <select
              value={workDay}
              onChange={(e) => setWorkDay(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            >
              <option value="1">1 (Monday)</option>
              <option value="2">2 (Tuesday)</option>
              <option value="3">3 (Wednesday)</option>
              <option value="4">4 (Thursday)</option>
              <option value="5">5 (Friday)</option>
              <option value="6">6 (Saturday)</option>
              <option value="7">7 (Sunday)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-[-15px]">Timing Type</label>
            <select
              value={natureOfTime}
              onChange={(e) => setTimingType(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            >
              <option value="Flexible">Flexible</option>
              <option value="Fixed">Fixed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-[-15px]">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            >
              <option value="">Select Role</option>
              <option value="employee">Employee</option>
              <option value="coowner">Co-owner</option>
              <option value="hod">HOD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-[15px]">Shift Type</label>
            <select
              value={shiftType}
              onChange={(e) => setShiftType(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              
            >
              <option value="Day">Day</option>
              <option value="Night">Night</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Page Component
function Page() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const breadcrumbs = [
    { href: "/", label: "Home" },
    { href: "/employee", label: "Employees" },
  ];

  const handleAddEmployeeClick = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="space-y-2 mt-3 flex justify-between items-center">
        <h1 className="font-bold text-2xl text-accent">Employees</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
          onClick={handleAddEmployeeClick}
        >
          Add Employee
        </button>
      </div>
      <div>
        <EmployeeTable />
      </div>
      {isFormOpen && <AddEmployeeForm onClose={handleCloseForm} />}
    </div>
  );
}

export default Page;
