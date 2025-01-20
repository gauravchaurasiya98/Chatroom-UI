import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/apiService";
import {
  GENERAL,
  TECHNOLOGIES,
  NEWS_UPDATES,
  SOCIAL_UPDATES,
} from "../constants/roomConstants";

// Async Thunk for fetching messages
export const fetchMessages = createAsyncThunk(
  "rooms/fetchMessages",
  async ({ room, beforeDate }) => {
    const { data } = await api.get(
      `/api/messages/${room}?before=${beforeDate || ""}`
    );
    return { room, messages: data }; // Return the room and messages
  }
);

// Initial state for rooms
const initialState = {
  selectedRoom: null, // Default selected room
  rooms: {
    [GENERAL]: { messages: [], isFetching: false, hasMore: true },
    [TECHNOLOGIES]: { messages: [], isFetching: false, hasMore: true },
    [NEWS_UPDATES]: { messages: [], isFetching: false, hasMore: true },
    [SOCIAL_UPDATES]: { messages: [], isFetching: false, hasMore: true },
  },
};

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    selectRoom: (state, action) => {
      state.selectedRoom = action.payload; // Update the selected room
    },
    addMessage: (state, action) => {
      const { room, message } = action.payload;
      state.rooms[room].messages.push(message); // Append a new message
    },
    replaceMessageWithDbSaved: (state, action) => {
      const { room, tempId, dbSavedMessage } = action.payload;
      const messages = state.rooms[room].messages;
      const messageIndex = messages.findIndex((msg) => msg._id === tempId);
      if (messageIndex > -1) {
        messages[messageIndex] = dbSavedMessage; // Replace the temp message with DB saved
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state, action) => {
        const { room } = action.meta.arg;
        state.rooms[room].isFetching = true; // Set fetching state to true
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { room, messages } = action.payload;
        state.rooms[room].messages.unshift(...messages); // Append older messages at the top
        state.rooms[room].isFetching = false; // Reset fetching state
        state.rooms[room].hasMore = messages.length < 20 ? false : true; // Update hasMore based on response
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        const { room } = action.meta.arg;
        state.rooms[room].isFetching = false; // Reset fetching state on error
      });
  },
});

export const { selectRoom, addMessage, replaceMessageWithDbSaved } =
  roomsSlice.actions;
export default roomsSlice.reducer;
