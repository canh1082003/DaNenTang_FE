import { useEffect } from "react";
// import { getSocket } from "../../Utils/socket";
import socket from "../../Utils/socket";

export const useJoinConversation = (conversationId?: string) => {
  useEffect(() => {
    if (conversationId) {
      // const socket = getSocket();
      socket?.emit("joinRoom", conversationId);
      socket?.emit("markAsRead", conversationId);
    }
  }, [conversationId]);
};
