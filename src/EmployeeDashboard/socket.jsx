
import { io } from "socket.io-client";
import { CHAT_BASE_URL } from "../api/api";

let socket;

export const initializeSocket = (userId, userType) => {
  const query = { userId, role: userType };

  // replace with actual url
  socket = io(`${CHAT_BASE_URL}:9092`, { query });

  return socket;
};

export const getSocket = () => socket;