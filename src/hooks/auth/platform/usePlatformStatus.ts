import { useEffect, useState } from "react";
import api from "../../../API/API";
import { GET_PLATFORM_STATUS } from "./constanst";

export default function usePlatformStatus() {
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

 const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get(GET_PLATFORM_STATUS);
      setPlatforms(res.data.data || []);
    } catch (error) {
      console.error("❌ Lỗi khi lấy trạng thái platform:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Chỉ gọi 1 lần khi component mount
  useEffect(() => {
    fetchStatus();
  }, []);
  return { platforms, loading ,refetch: fetchStatus};
}
