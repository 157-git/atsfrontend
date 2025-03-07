import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  triggerFetch: false, // Flag to trigger useEffect in parent
};

const triggerSlice = createSlice({
  name: "trigger",
  initialState,
  reducers: {
    setTriggerFetch: (state) => {
      state.triggerFetch = !state.triggerFetch; // Toggle to trigger useEffect
    },
  },
});

// Export action
export const { setTriggerFetch } = triggerSlice.actions;

// Export reducer
export default triggerSlice.reducer;
