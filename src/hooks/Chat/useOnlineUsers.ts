import { useEffect, useState } from "react";
import api from "../../API/API";

export const useOnlineUsers = (token: string | null) => {
  const [onlineUsers, setOnlineUsers] = useState<Map<string, Date | null>>(
    new Map()
  );

  useEffect(() => {
    const loadOnlineUsers = async () => {
      try {
        const response = await api.get("/user/online-status", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.httpStatusCode === 200) {
          const newMap = new Map<string, Date | null>();
          response.data.data.users.forEach((user: any) => {
            if (user.isOnline) {
              newMap.set(user._id, null);
            } else {
              newMap.set(
                user._id,
                user.lastSeen ? new Date(user.lastSeen) : null
              );
            }
          });
          setOnlineUsers(newMap);
        }
      } catch (error) {
        console.error("Error loading online users:", error);
      }
    };

    loadOnlineUsers();
  }, [token]);

  return { onlineUsers, setOnlineUsers };
};
