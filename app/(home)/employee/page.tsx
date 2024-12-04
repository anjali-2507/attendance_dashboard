"use client"; // Marking this as a Client Component
import React, { useState } from "react";
import EmployeeTable from "@/components/employee/EmployeeTable";
import Breadcrumbs from "@/components/components/Breadcrumbs";
import { useAppSelector } from "@/redux/store";


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
  const [natureOfTime, setTimingType] = useState("Flexible"); // Default to "Flexible"
  const [role, setRole] = useState("");
  const [shiftType, setShiftType] = useState("Day"); // Default to "Day"

  // Submit handler to call the backend API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(user)
    const formattedCheckIn = new Date(`1970-01-01T${checkIn}`).toISOString();

    const employeeData = {
      employeeName,
      employeeNumber: phoneNumber,
      employerNumber: user?.number,
      checkIn: formattedCheckIn, // Use the corrected format
      natureOfTime,
      role,
      shiftType,
    };
    
    
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
        alert(error.error || "Failed to add employee");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
    console.log("Formatted checkIn:", formattedCheckIn);

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
  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
  <input
    type="text" // text type will allow number handling with restrictions
    value={phoneNumber}
    onChange={(e) => {
      // Only allow numbers
      const value = e.target.value;
      if (/^\d*$/.test(value)) { // Regex ensures only digits
        setPhoneNumber(value);
      }
    }}
    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
    required
    maxLength={10} // Maximum length set to 10
    placeholder="Enter number"
  />
</div>


          <div>
            <label className="block text-sm font-medium text-gray-700">Check In Time</label>
            <input
              type="time"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full appearance-none scrollbar-thumb-gray-500 scrollbar-track-gray-300 scrollbar-thin"
              required
              
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Timing Type</label>
            <select
              value={natureOfTime}
              onChange={(e) => setTimingType(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            >
              <option value="Flexible">Flexible</option>
              <option value="Fixed">Fixed</option>
            </select>
            <div>
  <label className="block text-sm font-medium text-gray-700">Role</label>
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


          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Shift Type</label>
            <select
              value={shiftType}
              onChange={(e) => setShiftType(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
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

