import { Form } from "react-router";
import api from "../services/apiService";
import { clearAuth } from "../store/authSlice";
import Store from "../store/chatroomStore";

export const logout = async ({ request }) => {
  try {
    const response = await api.post("/user/logout", {});
    if (response?.status === 200) {
      Store.dispatch(clearAuth());
      window.location.href = "/login";
    } else {
      console.error("Something went wrong:", response?.data || response);
    }
  } catch (error) {
    console.error(
      "Error while logout:",
      error.response?.status,
      error.response?.data?.message || "Unknown error"
    );
  }
};

const LogOut = () => {
  return (
    <div>
      <Form action="/logout" method="POST">
        <button type="submit" className="btn btn-outline-primary">
          Logout
        </button>
      </Form>
    </div>
  );
};

export default LogOut;
