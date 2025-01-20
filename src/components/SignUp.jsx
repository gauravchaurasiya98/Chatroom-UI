import { Form, Link, redirect } from "react-router";
import styles from "./SignUp.module.css";
import api from "../services/apiService";
import { useRef, useState } from "react";
import { setAuthToken, setUser } from "../store/authSlice";
import Store from "../store/chatroomStore";

export const registerUser = async ({ request }) => {
  try {
    const formData = await request.formData();
    const payload = Object.fromEntries(formData);
    const response = await api.post("/auth/register", payload);
    if (response?.status === 201) {
      Store.dispatch(setAuthToken(response.data?.authToken));
      Store.dispatch(setUser(response.data?.user));
      return redirect("/");
    } else {
      console.error("Something went wrong:", response?.data || response);
    }
  } catch (error) {
    console.error(
      "Error while registering user:",
      error.response?.status,
      error.response?.data?.message || "Unknown error"
    );
  }
};

const SignUp = () => {
  const password = useRef();
  const confirmPassword = useRef();
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateFullName = (fullName) => {
    const trimmedName = fullName?.trim();

    if (!trimmedName) {
      setFullNameError("Full Name is required.");
    } else if (/\b(undefined|null)\b/i.test(trimmedName)) {
      setFullNameError(
        'Full Name cannot contain the words "undefined" or "null".'
      );
    } else if (!/.{3,}/.test(trimmedName)) {
      setFullNameError("Full Name must contain at least 3 characters.");
    } else if (/[^a-zA-Z\s]/.test(trimmedName)) {
      setFullNameError("Full Name must only contain letters and spaces.");
    } else {
      setFullNameError("");
    }
  };

  const handleFullNameOnFocusOut = (event) => {
    validateFullName(event.target.value);
  };

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

  const validatePassword = (password) => {
    const lengthRegex = /.{8,}/; // Minimum 8 characters
    const uppercaseRegex = /[A-Z]/; // At least 1 uppercase letter
    const lowercaseRegex = /[a-z]/; // At least 1 lowercase letter
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; // At least 1 special character
    const numericRegex = /\d/; // At least 1 numeric value
    const repeatedCharsRegex = /^(?!.*(.)\1{3}).*$/; // No more than 3 repeated characters

    if (!lengthRegex.test(password)) {
      setPasswordError("Password must be at least 8 characters long.");
    } else if (!uppercaseRegex.test(password)) {
      setPasswordError("Password must include at least one uppercase letter.");
    } else if (!lowercaseRegex.test(password)) {
      setPasswordError("Password must include at least one lowercase letter.");
    } else if (!specialCharRegex.test(password)) {
      setPasswordError("Password must include at least one special character.");
    } else if (!numericRegex.test(password)) {
      setPasswordError("Password must include at least one numeric value.");
    } else if (!repeatedCharsRegex.test(password)) {
      setPasswordError(
        "Password must not contain more than 3 repeated characters."
      );
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordOnFocusOut = (event) => {
    validatePassword(event.target.value);
  };

  const validateConfirmPassword = () => {
    if (confirmPassword.current.value !== password.current.value) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = (event) => {
    // If there are any errors, stop the submission
    if (fullNameError || emailError || passwordError || confirmPasswordError) {
      event.preventDefault();
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className={`p-4 rounded shadow ${styles.signupContainer}`}>
        <div className="text-center mb-4">
          <h1 className="h4">Welcome to Chatroom!</h1>
          <p>Create your account to join the conversation.</p>
        </div>
        <Form method="POST" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="fullName"
              className={`form-label ${styles.signupLabel}`}
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className={`form-control ${styles.signupInput}`}
              placeholder="Enter your full name"
              onBlur={handleFullNameOnFocusOut}
              required
            />
            {fullNameError && (
              <small className="text-danger">{fullNameError}</small>
            )}
          </div>

          <div className="mb-3">
            <label
              htmlFor="email"
              className={`form-label ${styles.signupLabel}`}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${styles.signupInput}`}
              placeholder="Enter your email"
              onBlur={handleEmailOnFocusOut}
              required
            />
            {emailError && <small className="text-danger">{emailError}</small>}
          </div>

          <div className="mb-3">
            <label
              htmlFor="password"
              className={`form-label ${styles.signupLabel}`}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              ref={password}
              className={`form-control ${styles.signupInput}`}
              placeholder="Enter your password"
              onBlur={handlePasswordOnFocusOut}
              required
            />
            {passwordError && (
              <p className="text-danger small">{passwordError}</p>
            )}
            <small className="text-info">
              Password must be at least 8 characters, contain one uppercase
              letter, one lowercase letter, one special character (e.g., !, @,
              #, $), at least one numeric value, and have no more than three
              consecutive repeated characters.
            </small>
          </div>

          <div className="mb-3">
            <label
              htmlFor="confirm-password"
              className={`form-label ${styles.signupLabel}`}
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              ref={confirmPassword}
              className={`form-control ${styles.signupInput}`}
              placeholder="Enter your password"
              onBlur={validateConfirmPassword}
              required
            />
            {confirmPasswordError && (
              <small className="text-danger">{confirmPasswordError}</small>
            )}
          </div>

          <button type="submit" className={`btn w-100 ${styles.signupBtn}`}>
            Sign Up
          </button>
        </Form>
        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1" />
          <span className={`px-2 ${styles.textColor}`}>or</span>
          <hr className="flex-grow-1" />
        </div>
        <div className="text-center mt-3">
          <Link to="/login" className="btn w-100 btn-primary">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
