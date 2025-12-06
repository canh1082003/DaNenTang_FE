// export const connectSocketd = () => {
//   const token = getToken();
//   if (!token) {
//     console.warn("⚠️ Không có token → Không connect socket");
//     return null;
//   }
//   const socket: Socket = io(SOCKET_URL, {
//     transports: ["websocket"],
//     auth: {
//       token: token || "",
//     },
//   });

//   socket.on("connect", () => {
//     const userInfo = localStorage.getItem("userInfo");
//     const userId = userInfo ? JSON.parse(userInfo).id : null;
//     if (userId) {
//       socket.emit("setup", userId);
//       console.log("Setup socket cho user:", userId);
//     }
//   });
//   socket.on("zalo-qr", (base64: string) => {
//     console.log("📩 FE nhận được QR từ server");
//     window.dispatchEvent(new CustomEvent("zaloQR", { detail: base64 }));
//   });
//   // Listen for online status events
//   socket.on("userOnline", (data) => {
//     console.log("User online:", data);
//     window.dispatchEvent(new CustomEvent("userOnline", { detail: data }));
//   });

//   socket.on("userOffline", (data) => {
//     console.log("User offline:", data);
//     window.dispatchEvent(new CustomEvent("userOffline", { detail: data }));
//   });
//   socket.on(
//     "departmentUpdated",
//     ({ conversationId, oldDepartment, newDepartment }) => {
//       console.log(
//         `[Realtime] Department updated: ${oldDepartment} → ${newDepartment}`
//       );
//     }
//   );
//   socket.on("platform-status", (data) => {
//     console.log("📡 Received platform update:", data);
//   });
//   socket.onAny((event, data) => {
//     console.log("🛰️ [SOCKET ANY EVENT]", event, data);
//   });
// };

import { io, Socket } from "socket.io-client";
import { getToken } from "./getToken";
import { SOCKET_URL } from "./type";



let socket: Socket | null = null;

export const connectSocket = () => {
  const token = getToken();

  if (!token) {
    console.warn("⚠️ Không có token → Không connect socket");
    return null;
  }

  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
    });

    socket.on("connect", () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")!);
      const userId = userInfo.id;

      if (userId) {
      socket!.emit("setup", userId);
      console.log("Setup socket cho user:", userId);
    }
    });
    socket.on("userOnline", (data) => {
      console.log("User online:", data);
      window.dispatchEvent(new CustomEvent("userOnline", { detail: data }));
    });

    socket.on("userOffline", (data) => {
      console.log("User offline:", data);
      window.dispatchEvent(new CustomEvent("userOffline", { detail: data }));
    });
    socket.on(
      "departmentUpdated",
      ({ conversationId, oldDepartment, newDepartment }) => {
        console.log(
          `[Realtime] Department updated: ${oldDepartment} → ${newDepartment}`
        );
      }
    );
    socket.on("platform-status", (data) => {
      console.log("📡 Received platform update:", data);
    });

  }

  return socket;
};

export const getSocket = () => socket;
