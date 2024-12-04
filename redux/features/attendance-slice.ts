import { createSlice } from "@reduxjs/toolkit";

type AttendanceState = {
  value: {
    maxPageCount: number
    attendance: any[]
  } | null;
};

const initialState: AttendanceState = {
  value: null,
};

export const attendance = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    pushAttendancePage: (state, action) => {
      if (!state.value) {
        const maxPageCount = Math.ceil(action.payload.total / 10)
        state.value = {
          maxPageCount,
          attendance: [action.payload.data]
        }
      } else {
        const pageNumber = action.payload.pageNumber

        state.value.attendance[pageNumber] = action.payload.data
      }
    },
    updateAttendanceItem: (state, action) => {
      const index = state?.value?.attendance
        ?.flat(2)
        ?.findIndex((item: any) => item._id === action.payload._id);

      const pageNumber = action.payload.pageNumber;

      if (typeof index === "number" && index >= 0) {
        if (state.value?.attendance) {
          state.value.attendance[pageNumber] = {
            ...state.value.attendance[pageNumber],
            ...action.payload,
          };
        }
      }
    },
  },
});

export const { pushAttendancePage, updateAttendanceItem } = attendance.actions;

export default attendance.reducer;
