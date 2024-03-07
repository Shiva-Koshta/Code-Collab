import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
        name: "",
        email: "",
        contact: "",
        role: ""
    }
  },
  reducers: {
    setUserSlice: (state, action) => {
      const { name, contact, role, email } = action.payload;
      state.user.name = name;
      state.user.role = role;
      state.user.contact = contact;
      state.user.email = email;
      // localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
        state.user.name = "";
        state.user.contact = "";
        state.user.email = "";
        state.user.role = "";
    },
  },
});

export const { setUserSlice, logout } = userSlice.actions;
export default userSlice.reducer;
