import { Form, Link, redirect, useActionData } from "react-router";
import styles from "./LogIn.module.css";
import api from "../services/apiService";
import { useEffect, useState } from "react";
import { setAuthToken, setUser } from "../store/authSlice";
import Store from "../store/chatroomStore";

export const login = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const from = url.searchParams.get("from") || "/";
    const formData = await request.formData();
    const payload = Object.fromEntries(formData);
    const response = await api.post("/auth/login", payload);
    if (response?.status === 200) {
      Store.dispatch(setAuthToken(response.data?.authToken));
      Store.dispatch(setUser(response.data?.user));
      return redirect(from);
    } else {
      console.error("Something went wrong:", response?.data || response);
    }
  } catch (error) {
    console.error(
      "Error while login:",
      error.response?.status,
      error.response?.data?.message || "Unknown error"
    );
    if (error.response?.status === 401) {
      return {
        error: error.response?.data?.message || "Invalid email or password.",
      };
    }
  }
};

const LogIn = () => {
  const [showAlert, setShowAlert] = useState(true); // State to manage alert visibility
  const actionData = useActionData(); // Fetch the action response
  const [emailError, setEmailError] = useState("");

  // Reset the alert when actionData changes
  useEffect(() => {
    if (actionData?.error) {
      setShowAlert(true); // Show the alert again if there is an error
    }
  }, [actionData]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleEmailOnFocusOut = (event) => {
    validateEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    // If there are any errors, stop the submission
    if (emailError) {
      event.preventDefault();
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className={`p-4 rounded shadow ${styles.loginContainer}`}>
        <div className="text-center mb-4">
          <h1 className="h4">Welcome to Chatroom!</h1>
          <p>Please log in to join the conversation.</p>
        </div>
        <Form method="POST" onSubmit={handleSubmit}>
          {actionData?.error && showAlert && (
            <div
              className="alert alert-danger p-2 d-flex justify-content-between align-items-center"
              role="alert"
            >
              <span className="text-danger fw-semibold">
                {actionData.error}
              </span>
              <button
                type="button"
                className="close btn-close"
                aria-label="Close"
                onClick={() => setShowAlert(false)}
              ></button>
            </div>
          )}
          <div className="mb-3">
            <label
              htmlFor="email"
              className={`form-label ${styles.loginLabel}`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${styles.loginInput}`}
              placeholder="Enter your email"
              onBlur={handleEmailOnFocusOut}
              required
            />
            {emailError && <small className="text-danger">{emailError}</small>}
          </div>

          <div className="mb-3">
            <label
              htmlFor="password"
              className={`form-label ${styles.loginLabel}`}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-control ${styles.loginInput}`}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn w-100 btn-primary">
            Log In
          </button>
        </Form>
        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1" />
          <span className={`px-2 ${styles.textColor}`}>or</span>
          <hr className="flex-grow-1" />
        </div>
        <div className="text-center">
          <Link to="/signup" className={`btn w-100 ${styles.loginBtn}`}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LogIn;
