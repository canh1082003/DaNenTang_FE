import { useEffect, useState } from "react";
import api from "../../../API/API";
import { getToken } from "../../../Utils/getToken";
import { LOGOUT } from "./constants";

export const useLogout = () => {
  const [loading, setLoading] = useState(true);
  const token = getToken();
  const logout = async () => {
    try {
      setLoading(true);
      await api.get(LOGOUT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      console.error("❌ Lỗi khi lấy thông tin admin:", error);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading, logout
  };
};
