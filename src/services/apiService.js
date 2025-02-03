import axios from "axios";
import Cookies from "js-cookie";
import Store from "../store/chatroomStore";
import { setAuthToken } from "../store/authSlice";

const baseURL =
  process.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:3000";

// Utility to get values from cookies
export const getValueFromCookie = (key) => {
  return Cookies.get(key);
};

// Create an Axios instance
const api = axios.create({
  baseURL,
  withCredentials: true, // Enable cross-origin credentials
});

// Request interceptor for adding Authorization header
api.interceptors.request.use(
  (config) => {
    const authToken = Store.getState().auth.authToken;
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 && !error.config._retry) {
      error.config._retry = true; // Mark the request as retried
      if (error.config.url === "/user/refresh-token") {
        return Promise.reject(error); // Prevent retry for the refresh-token endpoint
      }
      try {
        const { data } = await api.post("/user/refresh-token", {});
        if (data) {
          Store.dispatch(setAuthToken(data?.authToken));
          error.config.headers.Authorization = `Bearer ${data?.authToken}`;
          return api.request(error.config); // Retry the failed request
        } else {
          return Promise.reject(error);
        }
      } catch (tokenError) {
        console.error(
          "Error while refreshing JWT:",
          tokenError.response?.status,
          tokenError.response?.data?.message || "Unknown error"
        );
        window.location.href = "/login"; // Redirect to login on failure
      }
    }
    return Promise.reject(error);
  }
);

export default api;
