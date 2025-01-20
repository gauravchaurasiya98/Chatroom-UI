import { Link } from "react-router";
import { useAuth } from "../hooks/auth";
import AppName from "./AppName";
import LogOut from "./Logout";

const Header = () => {
  const { isAuthenticated } = useAuth();
  return (
    <header
      className={`d-flex align-items-center py-3 border-bottom ${
        isAuthenticated
          ? "justify-content-between"
          : "flex-column flex-sm-row justify-content-center justify-content-sm-between gap-2 gap-sm-0"
      }`}
    >
      <AppName />
      {isAuthenticated ? (
        <LogOut />
      ) : (
        <div className="d-flex justify-content-center align-items-center gap-2">
          <Link to={"/login"} className="btn btn-outline-primary">
            Login
          </Link>
          <Link to={"/signup"} className="btn btn-primary">
            Sign-up
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
