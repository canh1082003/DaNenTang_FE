"use client";

import { useState } from "react";
import "./conversations.css";
import { use } from "marked";
import { useConversations } from "../../../hooks/auth/Conversation/useConversation";
import { getPlatformFromName, timeAgo } from "../../../Utils/formatDate";
import { LoadingModal } from "../../../components/Loading/ModalLoading";

export default function Conversations() {
  // const [conversations, setConversations] = useState([
  //   { id: 1, user: "Alice Johnson", platform: "Facebook",  messages: 45, lastMessage: "2 min ago" },
  //   { id: 2, user: "Bob Smith", platform: "WhatsApp",  messages: 23, lastMessage: "15 min ago" },
  //   { id: 3, user: "Carol White", platform: "Instagram",  messages: 12, lastMessage: "1 hour ago" },
  //   { id: 4, user: "David Brown", platform: "Telegram",  messages: 67, lastMessage: "2 hours ago" },
  //   { id: 5, user: "Eve Davis", platform: "Facebook",  messages: 8, lastMessage: "1 day ago" },
  // ])
  const [period, setPeriod] = useState<"all" | "week" | "month">("all");
  const { conversations, loading } = useConversations(period);
  console.log(conversations);

  const [showModal, setShowModal] = useState(false);
  const [newConv, setNewConv] = useState({ user: "", platform: "" });

  // const handleAddConversation = () => {
  //   if (newConv.user && newConv.platform) {
  //     setConversations([
  //       ...conversations,
  //       {
  //         id: conversations.length + 1,
  //         user: newConv.user,
  //         platform: newConv.platform,
  //         messages: 0,
  //         lastMessage: "just now",
  //       },
  //     ])
  //     setNewConv({ user: "", platform: "" })
  //     setShowModal(false)
  //   }
  // }

  // const handleDeleteConversation = (id: number) => {
  //   setConversations(conversations.filter((conv) => conv.id !== id))
  // }

  return (
    <div className="conversations-page">
      <div className="filter-bar">
        <label>Lọc:</label>
        <select
          value={period}
          onChange={(e) =>
            setPeriod(e.target.value as "all" | "week" | "month")
          }
        >
          <option value="all">Tất cả</option>
          <option value="week">Top trong tuần</option>
          <option value="month">Top trong tháng</option>
        </select>
      </div>

      <div className="table-container">
        <table className="conversations-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Platform</th>
              <th>Messages</th>
              <th>Last Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {conversations?.map((conv: any) => {
              const platform = getPlatformFromName(conv.name || "");
              const lastTime = conv.lastMessage?.createdAt
                ? timeAgo(conv.lastMessage.createdAt)
                : "";
              const username =
                conv.participants?.[0]?.username ||
                conv.user?.username ||
                "Ẩn danh";
              return (
                <tr key={conv.id}>
                  <td className="user-cell">
                    <td>{username}</td>
                  </td>
                  <td>{platform}</td>
                  <td>{conv.totalMessages || "-"}</td>
                  <td>{lastTime}</td>
                  <td className="actions-cell">
                    <button className="btn-icon" title="View">
                      👁️
                    </button>
                    <button className="btn-icon" title="Edit">
                      ✏️
                    </button>
                    <button
                      className="btn-icon delete"
                      title="Delete"
                      // onClick={() => handleDeleteConversation(conv.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <LoadingModal show={loading} text="Đang loadinggg..." />
    </div>
  );
}
