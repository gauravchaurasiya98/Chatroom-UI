import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../store/roomsSlice";
import {
  setInitialLoad,
  setNewMessageSent,
} from "../store/messageScrollerSlice";
import Message from "./Message";
import styles from "./Messages.module.css";

const Messages = () => {
  const dispatch = useDispatch();
  const messagesContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { selectedRoom, rooms } = useSelector((state) => state.rooms);
  const messages = rooms[selectedRoom].messages;
  const { isInitialLoad, isNewMessageSent } = useSelector(
    (state) => state.messageScroller
  );

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container || !selectedRoom || !rooms[selectedRoom].hasMore) {
      return;
    }
    // Check if the user has scrolled to the top
    if (container.scrollTop === 0 && !rooms[selectedRoom].isFetching) {
      setScrollPosition(container.scrollHeight); // Save the current scroll height to adjust later

      const beforeDate = rooms[selectedRoom].messages[0].createdAt;
      dispatch(fetchMessages({ room: selectedRoom, beforeDate }));
    }
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll); // Cleanup
    }
  }, [
    selectedRoom,
    rooms[selectedRoom].hasMore,
    rooms[selectedRoom].isFetching,
  ]);

  // Scroll to the bottom on initial load or room change or when a new message is sent
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && (isInitialLoad || isNewMessageSent)) {
      container.scrollTop = container.scrollHeight; // Directly scroll to the bottom
      dispatch(setInitialLoad(false));
      dispatch(setNewMessageSent(false));
    }
  }, [messages.length, isInitialLoad, isNewMessageSent]);

  // Effect to adjust scroll position when new messages are loaded
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && !isInitialLoad) {
      // Maintain current scroll position
      container.scrollTop =
        container.scrollHeight - scrollPosition + container.scrollTop;
    }
  }, [messages.length, scrollPosition]);

  return (
    <div
      className={`d-flex flex-column flex-fill gap-2 p-3 overflow-y-auto firefox-scrollbar position-relative ${styles.bgChat}`}
      ref={messagesContainerRef}
    >
      {rooms[selectedRoom].isFetching && (
        <div
          className="spinner-border spinner-border-sm position-absolute align-self-center"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      {messages.map((msg) => (
        <Message key={msg._id} message={msg} />
      ))}
    </div>
  );
};

export default Messages;
