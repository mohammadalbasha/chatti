import { io } from "socket.io-client";
const createSocketConnection = (token) => {
  // Establish the Socket.io connection with the server
  const socket = io("ws://localhost:4000", {
    // reconnectionDelayMax: 10000,
    auth: {
      token: token,
    },
    query: {
      token: token,
    },
  });

  // Additional socket event handlers can be added here

  return socket;
};

export { createSocketConnection };
