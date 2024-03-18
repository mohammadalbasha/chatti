import { useState, useContext } from "react";
import AuthContext from "../../store/auth-context";
import { Outlet } from "react-router-dom";
import { Header } from "../../components/header/header";
import React from "react";

function Main() {
  const authCtx = useContext(AuthContext);

  return (
    <div className="h-screen   ">
      <Header />

      <Outlet />
    </div>
  );
}

export default Main;
