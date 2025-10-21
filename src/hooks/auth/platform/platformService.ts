// src/hooks/platform/platformService.ts
import {
  CONNECT_FACEBOOK,
  CONNECT_TELEGRAM,
  DISCONNECT_FACEBOOK,
  DISCONNECT_TELEGRAM,
} from "./constanst";

export const getPlatformEndpoint = (action: "connect" | "disconnect", name: string) => {
  switch (name) {
    case "Facebook":
      return action === "connect" ? CONNECT_FACEBOOK : DISCONNECT_FACEBOOK;
    case "Telegram":
      return action === "connect" ? CONNECT_TELEGRAM : DISCONNECT_TELEGRAM;
    default:
      throw new Error(`❌ Không tìm thấy endpoint cho platform: ${name}`);
  }
};
