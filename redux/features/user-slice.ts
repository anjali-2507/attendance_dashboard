import { createSlice  } from "@reduxjs/toolkit";

type UserState = {
  value: {
    number: number | undefined;
    name: string | undefined;
    role: string | undefined;
    companyId:string | undefined;

  } | null;
};

const initialState: UserState = {
  value: null,
};

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      console.log(action.payload)
      state.value = { 
        name: action.payload.name,
        number: action.payload.phone,
        role: action.payload.role,
        companyId: action.payload.companyId,
      };
    },
  }
});

export const { updateUser } = user.actions;

export default user.reducer;
