import { FiMenu } from "react-icons/fi";

const ChatHamburger = ({ style, openSidebar }) => {
  return (
    <button
      className={`d-sm-none hamburger-menu ${style}`}
      onClick={openSidebar}
    >
      <FiMenu size={28} />
    </button>
  );
};

export default ChatHamburger;
