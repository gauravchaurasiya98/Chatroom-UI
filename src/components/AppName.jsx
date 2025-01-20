import { Link } from "react-router";

const AppName = () => {
  return (
    <Link to={"/"} className="text-white text-decoration-none fs-5 fw-bold">
      {"{chatroom}"}
    </Link>
  );
};

export default AppName;
