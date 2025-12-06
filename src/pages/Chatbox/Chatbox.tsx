import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import "../Chatbox/Chatbox.css";
import { Conversation } from "./type";
import { ALL_CONVERSATIONS } from "../../hooks/auth/chat/constants";
import api from "../../API/API";
import { getSocket } from "../../Utils/socket";
import { timeAgo } from "../../Utils/formatDate";
import ConversationDetail from "../Conversation_Details/ConversationDetail";
import { useNavigate } from "react-router-dom";
import { GET_CONVERSATION } from "../../hooks/auth/Conversation/constants";
import { getToken } from "../../Utils/getToken";

export default function ChatBox() {
  const [searchQuery, setSearchQuery] = useState("");
  const [conversationsAll, setConversationsAll] = useState<Conversation[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const userInfo = localStorage.getItem("userInfo");
  const token = userInfo ? JSON.parse(userInfo).token : null;
  const navigate = useNavigate();
  const handleClickConversation = async (id: string) => {
    const token = getToken();
    const res = await api.get(
      `${GET_CONVERSATION}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 200) {
      navigate(`/chat/${id}`);
    }
  };
  const [chatType, setChatType] = useState<"customer" | "staff">("customer");
  const [now, setNow] = useState(Date.now());
  const socket = getSocket();
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(i);
  }, []);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);
  const currentUserId = userInfo ? JSON.parse(userInfo).id : null;
  const currentUserDepartment = userInfo
    ? (JSON.parse(userInfo).department as string | undefined) ?? null
    : null;

  const currentUserRole = userInfo
    ? (JSON.parse(userInfo).role as string | undefined) ?? null
    : null;

  const filteredConversations = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();

    let filtered = conversationsAll;

    if (chatType === "staff") {
      filtered = filtered
    .filter((conversation) => conversation.type === "private")
    .filter((conversation) => {
      const participantIds = conversation.participants.map((p: any) =>
        String(p._id || p)
      );

      // ✅ chỉ những ai có trong participants hoặc admin mới thấy
      return (
        participantIds.includes(String(currentUserId)) ||
        currentUserRole === "admin"
      );
    });
   } else if (chatType === "customer") {
  filtered = filtered
    .filter((conversation) => conversation.type === "group")
    .filter((conversation) => {
      const participantIds = conversation.participants.map((p: any) =>
        String(p._id || p)
      );

      // chỉ những ai là participant hoặc admin mới thấy
      return (
        participantIds.includes(String(currentUserId)) ||
        currentUserRole === "admin"
      );
    });
}


    // 🧩 Lọc theo tìm kiếm (search)
    if (!q) return filtered;

    return filtered.filter((conversation) => {
      const isGroup = conversation.type === "group";
      const otherUser = isGroup
        ? null
        : conversation.participants?.find((p) => p._id !== currentUserId);
      const displayName = isGroup ? conversation.name : otherUser?.username;
      const lastMessageContent =
        (conversation as any).lastMessage?.content || "";

      return (
        displayName?.toLowerCase().includes(q) ||
        lastMessageContent.toLowerCase().includes(q)
      );
    });
  }, [
    debouncedQuery,
    conversationsAll,
    currentUserId,
    chatType,
    currentUserDepartment,
    currentUserRole,
  ]);

  // Load online users from API
  const loadOnlineUsers = async () => {
    try {
      const response = await api.get("/user/online-status", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.httpStatusCode === 200) {
        const onlineUserIds = response.data.data.users
          .filter((user: any) => user.isOnline)
          .map((user: any) => user._id);

        setOnlineUsers(new Set(onlineUserIds));
      }
    } catch (error) {
      console.error("Error loading online users:", error);
    }
  };

  // Check if user is online
  const isUserOnline = (userId: string) => {
    return onlineUsers.has(userId);
  };

  // Get conversation online status
  const getConversationOnlineStatus = (conversation: Conversation) => {
    if (conversation.type === "group") {
      const onlineParticipants =
        conversation.participants?.filter(
          (p) => p._id !== currentUserId && isUserOnline(p._id)
        ) || [];
      return {
        hasOnlineUsers: onlineParticipants.length > 0,
        onlineCount: onlineParticipants.length,
        totalCount: conversation.participants?.length || 0,
      };
    } else {
      const otherUser = conversation.participants?.find(
        (p) => p._id !== currentUserId
      );
      return {
        hasOnlineUsers: otherUser ? isUserOnline(otherUser._id) : false,
        onlineCount: otherUser && isUserOnline(otherUser._id) ? 1 : 0,
        totalCount: 1,
      };
    }
  };

  useEffect(() => {
    const getAll_conversations = async () => {
      try {
        const res = await api.get(`${ALL_CONVERSATIONS}?type=${chatType}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res?.data.data;
        const sortedData = [...data].sort((a: any, b: any) => {
          const aTime = new Date(
            a.lastMessage?.createdAt || a.createdAt || 0
          ).getTime();
          const bTime = new Date(
            b.lastMessage?.createdAt || b.createdAt || 0
          ).getTime();

          return bTime - aTime; // giảm dần => mới nhất lên đầu
        });
        setConversationsAll(sortedData);
        setConversationsAll((prev) => {
          const unreadMap = new Map(
            prev.map((c) => [c._id, c.unreadCount ?? 0])
          );

          const merged = sortedData.map((conv) => ({
            ...conv,
            unreadCount: conv.unreadCount ?? unreadMap.get(conv._id) ?? 0,
          }));

          return merged;
        });
      } catch (error) {
        console.error("Lỗi khi lấy conversation:", error);
      }
    };

    getAll_conversations();
    loadOnlineUsers();
  }, [chatType]);

  // Listen for online status changes
  useEffect(() => {
    const handleUserOnline = (event: CustomEvent) => {
      console.log("User online:", event.detail);
      setOnlineUsers((prev) => new Set([...prev, event.detail.userId]));
    };

    const handleUserOffline = (event: CustomEvent) => {
      console.log("User offline:", event.detail);
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(event.detail.userId);
        return newSet;
      });
    };

    window.addEventListener("userOnline", handleUserOnline as EventListener);
    window.addEventListener("userOffline", handleUserOffline as EventListener);

    return () => {
      window.removeEventListener(
        "userOnline",
        handleUserOnline as EventListener
      );
      window.removeEventListener(
        "userOffline",
        handleUserOffline as EventListener
      );
    };
  }, []);
  useEffect(() => {
    socket?.on(
      "departmentUpdated",
      ({ conversationId, oldDepartment, newDepartment }) => {
        console.log(
          `[Realtime] Department updated: ${oldDepartment} → ${newDepartment}`
        );

        setConversationsAll((prev) =>
          prev.map((conv) =>
            conv._id === conversationId
              ? { ...conv, assignedDepartment: newDepartment }
              : conv
          )
        );
      }
    );

    // cleanup listener khi component unmount
    return () => {
      socket?.off("departmentUpdated");
    };
  }, []);

  const updateConversationPreview = (message: any) => {
    setConversationsAll((prevConvs) => {
      const updated = prevConvs.map((conv) => {
        const isMatch = String(conv._id) === String(message.conversation);
        if (!isMatch) return conv;
        const senderId =
          (message.sender && (message.sender._id || message.sender)) ||
          undefined;
        const isMine = String(senderId) === String(currentUserId);
        const unread = !isMine ? ((conv.unreadCount as any) || 0) + 1 : 0; //
        return {
          ...conv,
          lastMessage: {
            content: message.content,
            createdAt: message.createdAt,
            sender: message.sender,
          },
          timestamp: message.createdAt,
          unreadCount: unread,
        } as any;
      });
      return [...updated].sort(
        (a, b) =>
          new Date(
            b.timestamp || b.lastMessage?.createdAt || b.createdAt || 0
          ).getTime() -
          new Date(
            a.timestamp || a.lastMessage?.createdAt || a.createdAt || 0
          ).getTime()
      );
    });
  };

  useEffect(() => {
    const handleNewMessagePreview = (message: any) => {
      updateConversationPreview(message);
    };
    socket?.on("newMessagePreview", handleNewMessagePreview);
    return () => {
      socket?.off("newMessagePreview", handleNewMessagePreview);
    };
  }, []);

  return (
    <div className="messaging-app">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">
            <h1>Tin nhắn</h1>
          </div>
          <div className="search-container">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm cuộc trò chuyện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <div className="chat-tabs">
          <button
            className={chatType === "customer" ? "active" : ""}
            onClick={() => setChatType("customer")}
          >
            💬 Khách hàng
          </button>
          <button
            className={chatType === "staff" ? "active" : ""}
            onClick={() => setChatType("staff")}
          >
            🧑‍💼 Nội bộ
          </button>
        </div>

        {/* 🔧 Changed: Dùng filteredConversations thay vì conversationsAll */}
        <div className="conversations-list">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation, index) => {
              const isGroup = conversation.type === "group";
              const onlineStatus = getConversationOnlineStatus(conversation);

              const otherUser = isGroup
                ? null
                : conversation.participants?.find(
                    (p) => p._id !== currentUserId
                  );

              const displayName = isGroup
                ? conversation.name
                : otherUser?.username;

              const lastSenderId =
                (conversation as any).lastMessage?.sender?._id ||
                (conversation as any).lastMessage?.sender;
              const isMyLast = String(lastSenderId) === String(currentUserId);
              const previewPrefix = isMyLast ? "Bạn: " : "";
              const isUnread =
                !isMyLast && ((conversation.unreadCount as any) || 0) > 0;

              return (
                <div
                  key={index}
                  className={`conversation-item ${
                    currentConversation?._id === conversation._id
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleClickConversation(conversation._id)}
                >
                  <div className="avatar-container">
                    {isGroup ? (
                      <div
                        className={`group-avatar group-${Math.min(
                          conversation.participants?.length || 0,
                          4
                        )}`}
                      >
                        {conversation.participants
                          ?.slice(0, 4)
                          .map((participant, idx) => (
                            <img
                              key={participant._id}
                              src={participant.avatar || "/placeholder.svg"}
                              alt={participant.username}
                              className={`slot slot-${idx + 1}`}
                            />
                          ))}
                        {conversation.participants &&
                          conversation.participants.length > 4 && (
                            <div className="group-avatar-overflow">
                              +{conversation.participants.length - 4}
                            </div>
                          )}
                      </div>
                    ) : (
                      <img
                        src={otherUser?.avatar || "/placeholder.svg"}
                        className="avatar"
                        alt={displayName}
                      />
                    )}
                    {onlineStatus.hasOnlineUsers && (
                      <div
                        className="online-indicator"
                        title={
                          isGroup
                            ? `${onlineStatus.onlineCount}/${onlineStatus.totalCount} thành viên online`
                            : "Đang online"
                        }
                      ></div>
                    )}
                  </div>

                  <div className="conversation-content">
                    <div className="conversation-header">
                      <h3 className="conversation-name">{displayName}</h3>
                      <span className="conversation-time">
                        {timeAgo(conversation.updatedAt!)}
                      </span>
                    </div>
                    <p
                      className="conversation-preview"
                      style={{
                        fontWeight: isUnread ? 800 : 400,
                      }}
                    >
                      {previewPrefix}
                      {(conversation as any).lastMessage?.content}
                    </p>
                    <div className="conversation-department">
                      <span>
                        Bộ phận:
                        <span
                          className={`department-badge ${(
                            conversation.assignedDepartment || ""
                          ).toLowerCase()}`}
                        >
                          {conversation.assignedDepartment
                            ? conversation.assignedDepartment.toUpperCase()
                            : "Không có"}
                        </span>
                      </span>
                    </div>
                    {isGroup && onlineStatus.hasOnlineUsers && (
                      <div className="online-info">
                        {onlineStatus.onlineCount} thành viên online
                      </div>
                    )}
                  </div>

                  {(conversation.unreadCount ?? 0) > 0 && (
                    <div className="unread-badge">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-result text-gray-400 italic px-3 mt-3">
              Không tìm thấy cuộc trò chuyện nào.
            </div>
          )}
        </div>
      </div>

      <ConversationDetail chatType={chatType} />
    </div>
  );
}
