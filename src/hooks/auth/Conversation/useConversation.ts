import { useEffect, useState } from "react";
import api from "../../../API/API";
import { GET_ALL_CONVERSATION_ADMIN } from "./constants";
import { IConversation } from "./type";
import { getToken } from "../../../Utils/getToken";



export const useConversations = (period: "all" | "week" | "month") => {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const token = getToken()
        const res = await api.get(
        `${GET_ALL_CONVERSATION_ADMIN}?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        setConversations(res.data.data || []);
      } catch (err: any) {
        setError(err.message || "Lỗi khi tải danh sách hội thoại");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [period]);

  return { conversations, loading, error };
};
