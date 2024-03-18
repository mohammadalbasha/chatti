import React, { useState } from "react";
import useHttp from "./useHttp";
import Input from "./Input";

const Signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [picture, setPicture] = useState(null);
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pictureError, setPictureError] = useState("");
  const { response, error, isLoading } = useHttp("/signup", "POST", {
    name,
    password,
    picture,
  });

  const handleNameChange = (value) => {
    setName(value);
    setNameError("");
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordError("");
  };

  const handlePictureChange = (value) => {
    setPicture(value);
    setPictureError("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      setNameError("Please enter your name");
    }

    if (!password) {
      setPasswordError("Please enter your password");
    }

    if (!picture) {
      setPictureError("Please select a picture");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (response) {
    return <div>Signup Successful!</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form className="flex flex-col items-center" onSubmit={handleFormSubmit}>
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={handleNameChange}
          required
          validate={(value) => {
            if (!value) {
              setNameError("Please enter your name");
            } else {
              setNameError("");
            }
          }}
        />
        {nameError && <p className="text-red-500 mb-2">{nameError}</p>}
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
          validate={(value) => {
            if (!value) {
              setPasswordError("Please enter your password");
            } else {
              setPasswordError("");
            }
          }}
        />
        {passwordError && <p className="text-red-500 mb-2">{passwordError}</p>}
        <Input
          type="file"
          placeholder="Picture"
          onChange={handlePictureChange}
          required
          validate={(value) => {
            if (!value) {
              setPictureError("Please select a picture");
            } else {
              setPictureError("");
            }
          }}
        />
        {pictureError && <p className="text-red-500 mb-2">{pictureError}</p>}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          type="submit"
        >
          Signup
        </button>
      </form>
    </div>
  );
};
