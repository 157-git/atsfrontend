import { io } from "socket.io-client";
import { CHAT_BASE_URL } from "../api/api";

let socket;

export const initializeSocket = (userId, userType) => {
  const query = { userId, role: userType };

  socket = io(`${CHAT_BASE_URL}:9092`, {
    query,
  });
  return socket;
};

export const getSocket = () => socket;

// const protocol = window.location.protocol === "https:" ? "wss" : "ws";
// socket = io(`${protocol}://rg.157careers.in:9092`, { query});
