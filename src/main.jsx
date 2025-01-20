import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import Store from "./store/chatroomStore.js";
import App from "./App.jsx";
import LogIn, { login } from "./components/LogIn.jsx";
import SignUp, { registerUser } from "./components/SignUp.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Chatroom from "./components/Chatroom.jsx";
import { logout } from "./components/Logout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LogIn />,
    action: login,
  },
  {
    path: "/signup",
    element: <SignUp />,
    action: registerUser,
  },
  {
    path: "/chatroom",
    element: (
      <ProtectedRoute>
        <Chatroom />
      </ProtectedRoute>
    ),
  },
  {
    path: "logout",
    action: logout,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={Store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
