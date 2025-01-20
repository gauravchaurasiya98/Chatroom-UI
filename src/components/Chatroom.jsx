import { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import ChatHome from "./ChatHome";
import ChatSection from "./ChatSection";

const Chatroom = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const selectedRoom = useSelector((state) => state.rooms.selectedRoom);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="row justify-content-center align-items-center">
      <Sidebar isSidebarOpen={isSidebarVisible} closeSidebar={toggleSidebar} />
      {selectedRoom === null ? (
        <ChatHome openSidebar={toggleSidebar} />
      ) : (
        <ChatSection openSidebar={toggleSidebar} />
      )}
    </div>
  );
};

export default Chatroom;
