import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

type EmployeeState = {
  value: {
    employee: {
      _id:string|undefined;
      employeeName: string | undefined;
      employeeNumber: number | undefined;
      role: string | undefined;
      natureOfTime: string | undefined;
      checkIn: Date | undefined;
      checkOut: Date | undefined;
      requiredHours: Date | undefined;
      status: string | undefined;
      shiftType: string | undefined;
      bufferTime: string |undefined;
    }[];
    maxPageCount: number;
  } | null;
};

const initialState: EmployeeState = {
  value: null,
};

export const employees = createSlice({
  name: "employees",
  initialState,
  reducers: {
    pushEmployeePage: (state, action) => {
      console.log(action.payload)
      if (!state.value) {
        const maxPageCount = Math.ceil(action.payload.total / 10)
        state.value = {
          maxPageCount,
          employee: [action.payload.data]
        }
      } else {
        const pageNumber = action.payload.pageNumber

        state.value.employee[pageNumber] = action.payload.data
      }
    },
    updateEmployeesData: (state, action) => {
      console.log(state.value)
      console.log(action.payload)
      // if(state.value){
      //   const employeeIndex = state.value.employee.findIndex(emp => emp._id === action.payload.id);
      //   console.log(employeeIndex)
      //   if (employeeIndex !== -1) {
      //     state.value.employee[employeeIndex] = {
      //       ...state.value.employee[employeeIndex],
      //       ...action.payload
      //     };
      //   }
      // }
    },
  },
});

export const { pushEmployeePage,updateEmployeesData } = employees.actions;

export default employees.reducer;
