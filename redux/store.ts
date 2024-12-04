import { configureStore } from "@reduxjs/toolkit";
import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";

import sidebarToggleReducer from "./features/toggle-slice";
import userReducer from "./features/user-slice";
import employeesReducer from "./features/employee-slice";
import attendanceReducer from "./features/attendance-slice";
import attendanceSummaryReducer from "./features/attendance-summary-slice";

export const store = configureStore({
  reducer: {
    sidebarToggle: sidebarToggleReducer,
    user: userReducer,
    employees: employeesReducer,
    attendance: attendanceReducer,
    attendanceSummary: attendanceSummaryReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<typeof store.dispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
