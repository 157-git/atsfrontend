// this file is created by sahil karnekar on date 14-01-2025

import { createSlice } from "@reduxjs/toolkit";

const employeeSlice = createSlice({
  name: "employeeProfileImage",
  initialState: {
    profileImageFromRedux: null, // Initially no image
  },
  reducers: {
    setProfileImageFromRedux(state, action) {
      state.profileImageFromRedux = action.payload;
    },
  },
});

export const { setProfileImageFromRedux } = employeeSlice.actions;
export default employeeSlice.reducer;
