import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router";
import api from "../services/apiService";
import { setAuthToken, setUser } from "../store/authSlice";

export const useAuth = () => useSelector((state) => state.auth);

export const useAuthChecked = () => {
  const dispatch = useDispatch();
  // const location = useLocation();
  // const navigate = useNavigate();
  const [isAuthChecked, setAuthChecked] = useState(false); // Track auth status check

  useEffect(() => {
    const fetchAuthToken = async () => {
      try {
        const { data } = await api.post("/user/refresh-token", {});
        if (data) {
          dispatch(setAuthToken(data?.authToken));
          dispatch(setUser(data?.user));
        } else {
          console.error(
            "Something went wrong while refreshing JWT on manual refresh:",
            data
          );
        }
      } catch (error) {
        console.error(
          "Error while refreshing JWT on manual refresh:",
          error.response?.status,
          error.response?.data?.message || "Unknown error"
        );
        // navigate(`/login?from=${encodeURIComponent(location.pathname)}`);
      } finally {
        setAuthChecked(true);
      }
    };
    fetchAuthToken();
  }, []);

  return isAuthChecked;
};
