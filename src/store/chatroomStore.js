import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import roomsReducer from "./roomsSlice";
import messageScrollerReducer from "./messageScrollerSlice";

const Store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    messageScroller: messageScrollerReducer,
  },
});

export default Store;
