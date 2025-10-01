import { useEffect } from "react";

export const useUserStatusEvents = (
  setOnlineUsers: React.Dispatch<React.SetStateAction<Map<string, Date | null>>>
) => {
  useEffect(() => {
    const handleUserOnline = (event: CustomEvent) => {
      setOnlineUsers((prev) => {
        const newMap = new Map(prev);
        newMap.set(event.detail.userId, null);
        return newMap;
      });
    };

    const handleUserOffline = (event: CustomEvent) => {
      const { userId, timestamp } = event.detail;
      setOnlineUsers((prev) => {
        const newMap = new Map(prev);
        newMap.set(userId, timestamp ? new Date(timestamp) : null);
        return newMap;
      });
    };

    window.addEventListener("userOnline", handleUserOnline as EventListener);
    window.addEventListener("userOffline", handleUserOffline as EventListener);

    return () => {
      window.removeEventListener(
        "userOnline",
        handleUserOnline as EventListener
      );
      window.removeEventListener(
        "userOffline",
        handleUserOffline as EventListener
      );
    };
  }, [setOnlineUsers]);
};
