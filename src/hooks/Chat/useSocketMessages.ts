import { useEffect } from "react";
// import { getSocket } from "../../Utils/socket";
import socket from "../../Utils/socket";

import { Message } from "../../pages/Chatbox/type";

export const useSocketMessages = (
  conversationId: string | undefined,
  myId: string | null,
  isNearBottom: () => boolean,
  scrollToBottom: () => void,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setLastReadAt: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  useEffect(() => {
    // const socket= getSocket();
    const handleNewMessage = (message: Message) => {
      if (message.conversation === conversationId) {
        const shouldStick = isNearBottom();
        setMessages((prev) => [...prev, message]);
        if (shouldStick) setTimeout(scrollToBottom, 0);
        socket?.emit("markAsRead", conversationId);
      }
    };

    const handleReadReceipt = (payload: {
      conversationId: string;
      userId: string;
      at: string;
    }) => {
      if (
        payload.conversationId === conversationId &&
        payload.userId !== myId
      ) {
        setLastReadAt(payload.at);
      }
    };

    socket?.on("newMessage", handleNewMessage);
    socket?.on("readReceipt", handleReadReceipt);

    return () => {
      socket?.off("newMessage", handleNewMessage);
      socket?.off("readReceipt", handleReadReceipt);
    };
  }, [
    conversationId,
    myId,
    isNearBottom,
    scrollToBottom,
    setMessages,
    setLastReadAt,
  ]);
};
