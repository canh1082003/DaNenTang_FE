import { useEffect, useCallback, useRef } from "react";
import api from "../../API/API";
import { GET_FULL_CONVERSATION } from "../../hooks/auth/chat/constants";
import { Conversation, Message } from "../../pages/Chatbox/type";

export const useConversationDetails = (
  conversationId: string | undefined,
  token: string | null,
  setConversation: (c: Conversation) => void,
  setMessages: (m: Message[]) => void,
  scrollToBottom: () => void
) => {
  // dùng useCallback để ổn định hàm scroll
  const safeScrollToBottom = useCallback(scrollToBottom, []);

  const hasScrolledRef = useRef(false);
  useEffect(() => {
    if (!conversationId) return;
    const getConversationDetails = async () => {
      try {
        const res = await api.get(
          `${GET_FULL_CONVERSATION}/${conversationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data.data as Conversation & { messages: Message[] };
        setConversation(data);
        setMessages(data.messages || []);
        if (!hasScrolledRef.current) {
          setTimeout(safeScrollToBottom, 0);
          hasScrolledRef.current = true;
        }
      } catch (error) {
        console.error("Error fetching conversation details:", error);
      }
    };

    getConversationDetails();
  }, [conversationId, token, setConversation, setMessages, safeScrollToBottom]);
};
