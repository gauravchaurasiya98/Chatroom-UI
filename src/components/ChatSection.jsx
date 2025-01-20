import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-router";
import { IoMdSend } from "react-icons/io";
import ChatHamburer from "./ChatHamburger";
import Messages from "./Messages";
import { emitMessage } from "../services/websocketService";
import { setNewMessageSent } from "../store/messageScrollerSlice";
import "./ChatSection.css";

const ChatSection = ({ openSidebar }) => {
  const messageRef = useRef("");
  const dispatch = useDispatch();
  const selectedRoom = useSelector((state) => state.rooms.selectedRoom);

  const sendMessage = () => {
    let content = messageRef.current.value;
    content = content.trim();
    if (content) {
      emitMessage(selectedRoom, content);
      dispatch(setNewMessageSent(true));
    }
    messageRef.current.value = "";
    adjustHeight(); // Reset height to 1 row
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = () => {
    adjustHeight(); // Adjust height dynamically as user types
  };

  const adjustHeight = () => {
    const textarea = messageRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height for accurate scrollHeight calculation
      textarea.style.height = `${Math.min(textarea.scrollHeight, 5 * 24)}px`; // Adjust dynamically up to 5 rows
      textarea.style.overflowY =
        textarea.value.split("\n").length > 5 ? "auto" : "hidden";
    }
  };

  return (
    <div className="col-12 col-sm-9 p-0 vh-100 d-flex flex-column">
      <div className="d-flex align-items-center py-3 chat-header">
        <ChatHamburer openSidebar={openSidebar} />
        <div className="flex-grow-1 text-center fs-5 fw-bold">
          {selectedRoom && selectedRoom.replace("_", " ")}
        </div>
      </div>
      <Messages />
      <Form
        className="chat-footer"
        method="POST"
        onSubmit={(e) => e.preventDefault()}
      >
        <textarea
          ref={messageRef}
          className="chat-input"
          placeholder="Type your message..."
          rows={1}
          onKeyDown={handleKeyDown}
          onInput={handleInputChange}
        />
        <button
          type="submit"
          className="d-flex align-items-center justify-content-end send-button"
          onClick={sendMessage}
        >
          <IoMdSend size={24} />
        </button>
      </Form>
    </div>
  );
};

export default ChatSection;
