import { useEffect } from "react";
import socket from "../../Utils/socket";

export const useJoinConversation = (conversationId?: string) => {
  useEffect(() => {
    if (conversationId) {
      socket.emit("joinRoom", conversationId);
      socket.emit("markAsRead", conversationId);
    }
  }, [conversationId]);
};
