import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ToggleState = {
  value: boolean;
};

const initialState: ToggleState = {
  value: false
};

export const sidebarToggle = createSlice({
  name: "sidebarToggle",
  initialState,
  reducers: {
    toggle: (state) => {
      state.value = !state.value
    }
  },
});

export const { toggle } = sidebarToggle.actions;

export default sidebarToggle.reducer;
