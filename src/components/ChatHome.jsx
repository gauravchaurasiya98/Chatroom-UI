import ChatHamburger from "./ChatHamburger";
import "./ChatSection.css";

const ChatHome = ({ openSidebar }) => {
  return (
    <div className="col-12 col-sm-9 p-3 vh-100 d-flex flex-column bg-home">
      <ChatHamburger style={"align-self-start"} openSidebar={openSidebar} />
      <div className="d-flex flex-column flex-fill align-items-center justify-content-center text-center">
        <p className="lead">
          Please select a room from the menu to start chatting!
        </p>
      </div>
    </div>
  );
};

export default ChatHome;
