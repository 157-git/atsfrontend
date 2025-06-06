// this file created by sahil karnekar date 14-01-2025 for redux state management

import { configureStore } from "@reduxjs/toolkit";
import employeeProfileImageReducer from "./employeeSlice";
import triggerReducer from "../sclices/triggerSlice";
import stopwatchReducer from "../sclices/stopwatchSlice";

const store = configureStore({
  reducer: {
    employeeProfileImage: employeeProfileImageReducer,
    trigger: triggerReducer,
    stopwatch: stopwatchReducer,
  },
});

export default store;

