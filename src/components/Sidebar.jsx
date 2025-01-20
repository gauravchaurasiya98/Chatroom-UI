import { FiX } from "react-icons/fi";
import AppName from "./AppName";
import FooterCredits from "./FooterCredits";
import RoomMenu from "./RoomMenu";
import "./Sidebar.css";

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
  return (
    <div
      className={`d-flex flex-column p-0 vh-100 sidebar-container ${
        isSidebarOpen ? "open" : ""
      }`}
    >
      <div className="sidebar-header d-flex align-items-center justify-content-between py-3">
        <AppName />
        <button className="d-sm-none close-button" onClick={closeSidebar}>
          <FiX size={26} />
        </button>
      </div>
      <RoomMenu />
      <FooterCredits style={"m-2"} />
    </div>
  );
};

export default Sidebar;
