import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timeString: "00:00:00",
  isRunning: true, // Timer starts automatically
};

const stopwatchSlice = createSlice({
  name: "stopwatch",
  initialState,
  reducers: {
    startTimer: (state) => {
      state.isRunning = true;
    },
    stopTimer: (state) => {
      state.isRunning = false;
    },
    updateTime: (state, action) => {
      state.timeString = action.payload;
    },
  },
});

export const { startTimer, stopTimer, updateTime } = stopwatchSlice.actions;
export default stopwatchSlice.reducer;