import api from "../../../API/API";
import { getPlatformEndpoint } from "./platformService";

export const connectPlatform = async (name: string, id: number) => {
  try {
    const endpoint = getPlatformEndpoint("connect",name)
    const res = await api.post(endpoint, { id });
    return res.data.data;
  } catch (error) {
    console.error("❌ Lỗi khi connect:", error);
    throw error;
  }
};
