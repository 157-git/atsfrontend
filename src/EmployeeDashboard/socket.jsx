import { io } from "socket.io-client";

let socket;

export const initializeSocket = (userId, userType) => {
  const query = { userId, role: userType };

  // replace with actual url
  socket = io("http://localhost:9092", { query });

  return socket;
};

export const getSocket = () => socket;
