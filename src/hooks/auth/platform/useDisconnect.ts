import api from "../../../API/API";
import { getPlatformEndpoint } from "./platformService";

export const disconnectPlatform = async (name: string, id: number) => {
  try {
    const endpoint = getPlatformEndpoint("disconnect",name)
    const res = await api.post(endpoint, { id });
    return res.data.data;
  } catch (error) {
    console.error("❌ Lỗi khi disconnect:", error);
    throw error;
  }
};
