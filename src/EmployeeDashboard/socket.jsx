
import { io } from "socket.io-client";

let socket;

export const initializeSocket = (userId, userType) => {
  const query = { userId, role: userType };

  // replace with actual url
  socket = io("http://192.168.1.39:9092", { query });

  return socket;
};

export const getSocket = () => socket;