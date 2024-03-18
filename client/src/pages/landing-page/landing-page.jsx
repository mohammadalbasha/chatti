import { useContext } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";

import React from "react";
import AuthContext from "../../store/auth-context";

function LandingPage() {
  const authCtx = useContext(AuthContext);
  const location = useLocation().pathname;

  return !authCtx.isLoggedIn ? (
    <div className=" bg-yellow-300 h-screen flex flex-col items-center justify-center">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src="https://hstp-events.com/templates/jl_balder_pro/custom/images/logo.png"
          style={{ width: "30%", maxWidth: "800px" }}
        />
      </div>
      <Link
        className=" bg-white text-yellow-500 border-indigo-500  text-lg border-2 rounded-md mt-6 px-4 py-2"
        to={"/signin"}
      >
        {" "}
        signin
      </Link>
    </div>
  ) : (
    <Navigate to={"/chat"} state={{ from: location }} replace />
  );
}

export default LandingPage;
