import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../../store/auth-context";

export function Authenticated({ children }) {
  const authCtx = useContext(AuthContext);
  const location = useLocation().pathname;

  return authCtx.isLoggedIn ? (
    children
  ) : (
    <Navigate to={"/signin"} state={{ from: location }} replace />
  );
}
