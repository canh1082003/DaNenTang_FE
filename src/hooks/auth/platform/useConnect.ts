import api from "../../../API/API";
import { getToken } from "../../../Utils/getToken";
import { getPlatformEndpoint } from "./platformService";

export const connectPlatform = async (name: string, id: number) => {
  try {
    const endpoint = getPlatformEndpoint("connect",name)
    const token = getToken();
    const bodyData = { id };
    // const config = {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   }
    // };
    const res = await api.post(endpoint,bodyData);
    return res.data.data;
  } catch (error) {
    console.error("❌ Lỗi khi connect:", error);
    throw error;
  }
};
