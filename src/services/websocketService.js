import { io } from "socket.io-client";
import Store from "../store/chatroomStore";
import {
  addMessage,
  fetchMessages,
  replaceMessageWithDbSaved,
  selectRoom,
} from "../store/roomsSlice";
import { setInitialLoad } from "../store/messageScrollerSlice";

let socket;
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3000";

const isSocketConnected = () => {
  if (socket) {
    return true;
  } else {
    const authToken = Store.getState().auth.authToken;
    if (authToken) {
      connectSocket(authToken);
      return true;
    } else {
      console.error("Auth token missing. Cannot connect to socket.");
      return false;
    }
  }
};

export const connectSocket = (authToken) => {
  socket = io(baseURL, {
    auth: { token: authToken },
  });

  // Event listeners for client-side interactions
  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
  });

  // Listen for server events
  socket.on("newMessage", ({ room, message }) => {
    // console.log(`Message received in room ${room}:`, message);
    Store.dispatch(addMessage({ room, message }));
  });

  socket.on("disconnect", () => {
    console.warn("Disconnected from WebSocket server");
  });
};

// Emit events to the server
export const joinRoom = (room) => {
  if (isSocketConnected()) {
    socket.emit("joinRoom", room, (response) => {
      if (response.success) {
        console.log(`Joined room: ${response.room}`);
        loadMessages(room); // Fetch messages only if not already loaded
        Store.dispatch(setInitialLoad(true));
        Store.dispatch(selectRoom(room));
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
      } else {
        console.error(
          "Error while sending message: %s",
          response?.error || "Unknown error"
        );
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
