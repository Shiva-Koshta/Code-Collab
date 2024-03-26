import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      // localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;

// separate action creator for fetching user data
export const fetchUser = () => async (dispatch) => {
  try {
    const response = await axios.get("/api/user");
    dispatch(setUser(response.data));
  } catch (error) {
    console.error("Failed to fetch user data", error);
  }
};

