import { createSlice } from "@reduxjs/toolkit";

const messageScrollerSlice = createSlice({
  name: "messageScroller",
  initialState: {
    isInitialLoad: true,
    isNewMessageSent: false,
  },
  reducers: {
    setInitialLoad: (state, action) => {
      state.isInitialLoad = action.payload;
    },
    setNewMessageSent: (state, action) => {
      state.isNewMessageSent = action.payload;
    },
  },
});

export const { setInitialLoad, setNewMessageSent } =
  messageScrollerSlice.actions;
export default messageScrollerSlice.reducer;
