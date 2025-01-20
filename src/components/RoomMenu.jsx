import { useSelector } from "react-redux";
import { BiNews } from "react-icons/bi";
import { GrTechnology } from "react-icons/gr";
import { IoShareSocial } from "react-icons/io5";
import { MdGroupAdd } from "react-icons/md";
import { joinRoom } from "../services/websocketService";
import {
  GENERAL,
  NEWS_UPDATES,
  SOCIAL_UPDATES,
  TECHNOLOGIES,
} from "../constants/roomConstants";

const RoomMenu = () => {
  const selectedRoom = useSelector((state) => state.rooms.selectedRoom);

  return (
    <div className="list-group list-group-flush flex-fill overflow-y-auto">
      <button
        type="button"
        className={`list-group-item list-group-item-action py-3 text-truncate ${
          selectedRoom === GENERAL ? "active" : ""
        }`}
        onClick={() => joinRoom(GENERAL)}
      >
        <MdGroupAdd
          style={{ marginRight: "8px", marginBottom: "4px" }}
          size={21}
        />
        General
      </button>
      <button
        type="button"
        className={`list-group-item list-group-item-action py-3 text-truncate ${
          selectedRoom === TECHNOLOGIES ? "active" : ""
        }`}
        onClick={() => joinRoom(TECHNOLOGIES)}
      >
        <GrTechnology
          style={{ marginRight: "8px", marginBottom: "4px" }}
          size={21}
        />
        Technologies
      </button>
      <button
        type="button"
        className={`list-group-item list-group-item-action py-3 text-truncate ${
          selectedRoom === NEWS_UPDATES ? "active" : ""
        }`}
        onClick={() => joinRoom(NEWS_UPDATES)}
      >
        <BiNews style={{ marginRight: "8px", marginBottom: "4px" }} size={21} />
        News Updates
      </button>
      <button
        type="button"
        className={`list-group-item list-group-item-action py-3 text-truncate ${
          selectedRoom === SOCIAL_UPDATES ? "active" : ""
        }`}
        onClick={() => joinRoom(SOCIAL_UPDATES)}
      >
        <IoShareSocial
          style={{ marginRight: "8px", marginBottom: "4px" }}
          size={21}
        />
        Social Updates
      </button>
    </div>
  );
};

export default RoomMenu;
