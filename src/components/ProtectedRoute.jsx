import { Navigate, useLocation } from "react-router";
import { useAuth, useAuthChecked } from "../hooks/auth";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isAuthChecked = useAuthChecked();

  if (!isAuthChecked) {
    return <Spinner />;
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate
      to={`/login?from=${encodeURIComponent(location.pathname)}`}
      replace
    />
  );
};

export default ProtectedRoute;
