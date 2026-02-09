// import { io } from "socket.io-client";
// import { CHAT_BASE_URL } from "../api/api";

// let socket;

// export const initializeSocket = (userId, userType) => {
//   console.log("INSIDE INITIALIZE SOCKET::",userId,userType)
//   const query = { userId, role: userType };

// socket = io("http://localhost:9092", {
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

let socket = null; // 🔴 ONE global socket

export const initializeSocket = (userId, userType) => {
  // 🔒 prevent multiple sockets
  if (socket) {
    return socket;
  }

  socket = io(CHAT_BASE_URL, {
    path: "/chat-socket",
    query: {
      userId,
      role: userType,
    },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("🟢 SOCKET CONNECTED", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("🔴 SOCKET DISCONNECTED");
    socket = null; // allow reconnect
  });

  socket.on("connect_error", (err) => {
    console.error("❌ SOCKET ERROR", err.message);
  });

  return socket;
};

export const getSocket = () => socket;

