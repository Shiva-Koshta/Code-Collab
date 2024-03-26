import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    logout: (state) => {
      state.name = "";
    },
  },
});

export const { setName, logout } = userSlice.actions;
export default userSlice.reducer;
