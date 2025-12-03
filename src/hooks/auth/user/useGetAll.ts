import { useEffect, useState } from "react";
import { GET_ALL_USER } from "./constant";
import api from "../../../API/API";
import { getToken } from "../../../Utils/getToken";
import { toast } from "react-toastify";

export const useGetAllUser = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = getToken();
  const config = {
      headers: {
          Authorization: `Bearer ${token}`,
        },
    };
    useEffect(() => {
        try {
      const fetchAllUsers = async () => {
        const user = await api.get(GET_ALL_USER, config);
        const data = user.data.data;
   
        setStaff(data|| []);
        setLoading(false);
      };
      fetchAllUsers();
    } catch (error: any) {
      const errorData = error.response?.data;
      const errorMessage = errorData.errors[0]?.errorMessage || "Đã xảy ra lỗi";
      toast.error(errorMessage);
      throw error;
    }
    }, []);
  return { staff, loading };
};
