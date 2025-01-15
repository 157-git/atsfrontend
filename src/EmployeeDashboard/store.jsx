// this file created by sahil karnekar date 14-01-2025 for redux state management

import { configureStore } from "@reduxjs/toolkit";
import employeeProfileImageReducer from "./employeeSlice";

const store = configureStore({
  reducer: {
    employeeProfileImage: employeeProfileImageReducer,
  },
});

export default store;
