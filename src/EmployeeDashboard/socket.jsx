// import { io } from "socket.io-client";
// import { CHAT_BASE_URL } from "../api/api";

// let socket;

// export const initializeSocket = (userId, userType) => {
//   const query = { userId, role: userType };

// socket = io("https://rg.157careers.in", {
//   path: "/socket.io",
//   transports: ["websocket"],
//   query: {
//     userId,
//     role: userType
//   }
// });

//   return socket;
// };

// export const getSocket = () => socket;

//-------------------------------------------------------------------------

// import { io } from "socket.io-client";

// let socket = null;

// export const initializeSocket = (userId, userType) => {
//   if (!socket) {
//     socket = io("http://localhost:9092", {
//       transports: ["websocket"], // force stable transport
//       query: {
//         userId,
//         role: userType,
//       },
//     });

//     console.log("🧪 FRONTEND SOCKET HANDSHAKE", {
//   userId,
//   userType
// });


//     socket.on("connect", () => {
//       console.log("✅ Socket connected:", socket.id);
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("❌ Socket disconnected:", reason);
//     });
//   }

//   return socket;
// };

// export const getSocket = () => socket;


//------------------------------------------------------------------------------------

import { io } from "socket.io-client";
import { CHAT_BASE_URL } from "../api/api";

let socket;

export const initializeSocket = (userId, userType) => {
  const query = { userId, role: userType };

socket = io(CHAT_BASE_URL, {
  path: "/socket.io",
  query,
  transports: ["websocket", "polling"],
  withCredentials: true,
});
  return socket;
};

export const getSocket = () => socket;