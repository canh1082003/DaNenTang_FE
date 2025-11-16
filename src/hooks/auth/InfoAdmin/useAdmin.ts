import { useEffect, useState } from "react";
import api from "../../../API/API";
import { GET_ADMIN_INFO } from "./constants";
import { getToken } from "../../../Utils/getToken";

export const useAdmin = () => {
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
    const token = getToken()
  const fetchAdminInfo = async () => {
    try {
      setLoading(true);
      const res = await api.get(GET_ADMIN_INFO,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdminInfo(res.data.data || {});
    } catch (error) {
      console.error("❌ Lỗi khi lấy thông tin admin:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAdminInfo();
  }, []);

  return {
    adminInfo,
    loading,
  };
};
