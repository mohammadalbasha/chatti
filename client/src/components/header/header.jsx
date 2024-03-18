import React, { useContext, useState } from "react";
import { Button, Modal } from "flowbite-react";
import AuthContext from "../../store/auth-context";
import styles from "./header.module.css";
import { AddFriend } from "../add-friend/add-friend";
import { TermsOfUsage } from "../terms-of-usage/terms-of-usage";

export function Header() {
  const authContext = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);

  return (
    <section className="flex  items-center justify-between bg-slate-600">
      <div className=" ">
        <img
          className="w-30 h-20 m-2 ml-8"
          src="https://cdn-icons-png.flaticon.com/512/2840/2840204.png"
        />
      </div>

      <Button onClick={() => setOpenModal(true)}>
        {authContext.isLoggedIn ? "Add Friends" : "Our Terms"}
      </Button>
      {authContext.isLoggedIn && (
        <div className="bg-black hover:bg-yellow-300 text-white text-m text-center m-3 px-6 py-2 border-gray-800 border-spacing-2 border-2 hover:cursor-pointer">
          <a onClick={authContext.logout}>Logout</a>
        </div>
      )}

      {authContext.isLoggedIn && (
        <AddFriend openModal={openModal} setOpenModal={setOpenModal} />
      )}
      {!authContext.isLoggedIn && (
        <TermsOfUsage openModal={openModal} setOpenModal={setOpenModal} />
      )}
    </section>
  );
}
