import api from "../../../API/API";
import { getToken } from "../../../Utils/getToken";
import { getPlatformEndpoint } from "./platformService";

export const disconnectPlatform = async (name: string, id: number) => {
  try {
    const token = getToken();
    const bodyData = { id };
    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   }
    // };
    const endpoint = getPlatformEndpoint("disconnect",name)
    const res = await api.post(endpoint,bodyData);
    return res.data.data;
  } catch (error) {
    console.error("❌ Lỗi khi disconnect:", error);
    throw error;
  }
};
