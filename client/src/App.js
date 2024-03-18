import { useEffect, useState } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import React from "react";
import { router } from "./routes/routes";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const UserAuthenticationHandler = (user) => {
    fetch("http://localhost:3001/api/users/signin", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: `mohammad${user}`, password: "12345678" }),
    })
      .then((response) => {
        response.json();
      })
      .then((data) => setIsLoggedIn(true))
      .catch(() => {});
  };

  return <RouterProvider router={router} />;
}

export default App;
