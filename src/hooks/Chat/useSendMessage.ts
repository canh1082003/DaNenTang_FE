// import { useParams } from "react-router-dom";
// import api from "../../API/API";
// import { SEND_MESSAGE } from "./constants";

// export const useSendMessage = (token: string | null) => {
//   const { conversationId } = useParams<{ conversationId: string }>();
//   console.log(conversationId);
//   const sendMessage = async (
//     payload: { content?: string; type: string } | FormData
//   ) => {
//     try {
//       let res;

//       if (payload instanceof FormData) {
//         // if (conversationId) {
//         //   payload.set("conversationId", conversationId);
//         // }
//         // if (!payload.has("type")) {
//         //   payload.append("type", "file"); // hoặc "image"
//         // }
//         // if (!payload.has("content")) {
//         //   payload.append("content", ""); // tránh bị thiếu content
//         // }
//         for (const [key, value] of payload.entries()) {
//           console.log(key, value);
//         }
//         console.log(payload);
//         res = await api.post(`${SEND_MESSAGE}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         });
//       } else {
//         res = await api.post(
//           `${SEND_MESSAGE}`,
//           {
//             conversationId,
//             content: payload.content || "",
//             type: payload.type,
//           },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//       }

//       return res?.data;
//     } catch (err: any) {
//       console.error("SendMessage error:", err.response?.data || err.message);
//       throw err;
//     }
//   };

//   return { sendMessage };
// };
import { useParams } from "react-router-dom";
import api from "../../API/API";
import { SEND_MESSAGE } from "./constants";

export const useSendMessage = (token: string | null) => {
  const { conversationId } = useParams<{ conversationId: string }>();

  const sendMessage = async (
    payload: { content?: string; type?: string } | FormData
  ) => {
    try {
      let res;
      if (payload instanceof FormData) {
        res = await api.post(`${SEND_MESSAGE}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // 🧩 Nếu chỉ gửi text (JSON)
        res = await api.post(
          `${SEND_MESSAGE}`,
          {
            conversationId,
            content: payload.content || "",
            type: payload.type || "text",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      return res?.data;
    } catch (err: any) {
      console.error("SendMessage error:", err.response?.data || err.message);
      throw err;
    }
  };

  return { sendMessage };
};
