import { useSelector } from "react-redux";
import "./Message.css";

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${day}-${month}-${year} ${time}`;
};

const Message = ({ message }) => {
  const user = useSelector((state) => state.auth.user);
  const { sender, content, createdAt } = message;
  const currentUser = user.id === sender._id;

  return (
    <div className={`message ${currentUser ? "sent" : "received"}`}>
      <div className="message-sender">
        {currentUser ? "You" : sender.fullName}
      </div>
      <div className="message-content">{content}</div>
      <div className="message-timestamp">{formatDate(createdAt)}</div>
    </div>
  );
};

export default Message;
