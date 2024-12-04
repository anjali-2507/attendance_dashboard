import { createSlice } from "@reduxjs/toolkit";

type AttendanceSummaryState = {
  value: AttendanceSummary[] | null;
};

const initialState: AttendanceSummaryState = {
  value: null,
};

export const attendanceSummary = createSlice({
  name: "attendanceSummary",
  initialState,
  reducers: {
    initAttendanceSummary: (state, action) => {
      if (!state.value) {
        state.value = [action.payload];
      } else {
        state.value.push(action.payload);
      }
    },
  },
});

export const { initAttendanceSummary } = attendanceSummary.actions;

export default attendanceSummary.reducer;
