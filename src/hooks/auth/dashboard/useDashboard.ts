import { useEffect, useState } from "react";
import {
  Conversations,
  IPlatform,
  IRecentConversationsResponse,
} from "../../../pages/admin/Dashboard/type";
import {
  PLATFORMS_API,
  RECENTCONVERSATIONS_API,
  TOTALCONVERSATIONS_API,
} from "./constants";
import api from "../../../API/API";
import { getToken } from "../../../Utils/getToken";

export const useTotalConversations = () => {
  const [totalConversations, setTotalConversations] =
    useState<Conversations | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalConversations = async () => {
      try {
        setLoading(true);
        const res = await api.get(TOTALCONVERSATIONS_API);
        const data: Conversations = res.data.data;
        setTotalConversations(data);
      } catch (err: any) {
        console.error("Failed to fetch total conversations:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTotalConversations();
  }, []);

  return { totalConversations, loading, error };
};
export const useRecentConversations = () => {
  const [recentConversations, setRecentConversations] =
    useState<IRecentConversationsResponse | null>(null);
  console.log(recentConversations);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentConversations = async () => {
      try {
        setLoading(true);
        const res = await api.get(RECENTCONVERSATIONS_API);
        const data: IRecentConversationsResponse = res.data.data;
        setRecentConversations(data);
      } catch (err: any) {
        console.error("Failed to fetch total conversations:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentConversations();
  }, []);

  return { recentConversations, loading, error };
};
export const usePlatforms = () => {
  const [platforms, setPlatforms] = useState<IPlatform[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await api.get(PLATFORMS_API, config);
        const data: IPlatform[] = res.data.data;
        setPlatforms(data);
      } catch (err: any) {
        console.error("❌ Failed to fetch platform status:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPlatforms();
  }, []);

  return { platforms, loading, error };
};
