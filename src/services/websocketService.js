import { io } from "socket.io-client";
import api from "./apiService";
import Store from "../store/chatroomStore";
import { setAuthToken } from "../store/authSlice";
import {
  addMessage,
  fetchMessages,
  replaceMessageWithDbSaved,
  selectRoom,
} from "../store/roomsSlice";
import { setInitialLoad } from "../store/messageScrollerSlice";

let socket;
const baseURL =
  process.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:3000";
let retryCount = 0;
const MAX_RETRIES = 1;

const isSocketConnected = () => {
  if (socket && socket.connected) {
    return true;
  }
  const authToken = Store.getState().auth.authToken;
  if (authToken) {
    connectSocket(authToken);
    return true;
  } else {
    console.error("Auth token missing. Cannot connect to socket.");
    return false;
  }
};

export const connectSocket = (authToken) => {
  disconnectSocket(); // Prevent multiple instances
  socket = io(baseURL, { auth: { token: authToken } });

  // Event listeners for client-side interactions
  socket.off("connect").on("connect", () => {
    console.log("Connected to WebSocket server");
  });

  // Listen for server events
  socket.off("newMessage").on("newMessage", ({ room, message }) => {
    // console.log(`Message received in room ${room}:`, message);
    Store.dispatch(addMessage({ room, message }));
  });

  socket.off("disconnect").on("disconnect", (reason) => {
    console.warn(`Disconnected from WebSocket: ${reason}`);
  });
};

// Emit events to the server
export const joinRoom = (room) => {
  if (isSocketConnected()) {
    socket.emit("joinRoom", room, (response) => {
      if (response?.success) {
        console.log(`Joined room: ${response.room}`);
        loadMessages(room); // Fetch messages only if not already loaded
        Store.dispatch(setInitialLoad(true));
        Store.dispatch(selectRoom(room));
        retryCount = 0; // Reset retry count on success
      } else if (
        response.error.code === "TOKEN_EXPIRED" &&
        retryCount++ < MAX_RETRIES
      ) {
        console.warn("Auth token expired. Attempting to refresh...");
        refreshToken().then(() => joinRoom(room));
      } else if (response.error.code === "NO_TOKEN") {
        console.error(response.error.message);
        window.location.href = "/login";
      } else {
        console.error("Error while joining room:", response.error);
      }
    });
  }
};

export const emitMessage = (room, content) => {
  if (isSocketConnected()) {
    /*const tempMessage = {
      _id: `temp-${Date.now()}`, // Temporary ID for the message
      sender: {
        _id: "677eab1d26f8b1e752131f7e",
        fullName: "Gaurav Kumar",
      },
      content,
      createdAt: new Date().toISOString(),
      status: "pending", // Mark as pending until confirmed by the server
    };

    // Dispatch the temporary message
    Store.dispatch(addMessage({ room, message: tempMessage }));*/

    // Send a message to the server
    socket.emit("sendMessage", { room, content }, (response) => {
      if (response?.message) {
        // Update the message with the server-confirmed message
        /*Store.dispatch(
          replaceMessageWithDbSaved({
            room,
            tempId: tempMessage._id,
            dbSavedMessage: response?.message,
          })
        );*/
        retryCount = 0; // Reset retry count on success
      } else if (
        response.error.code === "TOKEN_EXPIRED" &&
        retryCount++ < MAX_RETRIES
      ) {
        console.warn("Auth token expired. Attempting to refresh...");
        refreshToken().then(() => emitMessage(room, content));
      } else if (response.error.code === "NO_TOKEN") {
        console.error(response.error.message);
        window.location.href = "/login";
      } else {
        console.error("Error while sending message:", response.error);
      }
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("Socket disconnected manually");
  }
};

const loadMessages = async (room) => {
  const state = Store.getState();
  if (state.rooms.rooms[room].messages.length === 0) {
    Store.dispatch(fetchMessages({ room }));
  }
};

const refreshToken = async () => {
  try {
    const { data } = await api.post("/user/refresh-token", {});
    if (data) {
      Store.dispatch(setAuthToken(data?.authToken));
    } else {
      window.location.href = "/login"; // Redirect to login on failure
    }
  } catch (error) {
    console.error(
      "Error while refreshing JWT:",
      error.response?.status,
      error.response?.data?.message || "Unknown error"
    );
    window.location.href = "/login"; // Redirect to login on failure
  }
};
