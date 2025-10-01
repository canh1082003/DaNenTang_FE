
import type React from "react"
import { useEffect, useState } from "react"
import { Search, Phone, Video, MoreVertical, Send, Paperclip, Smile, ArrowLeft, CloudFog } from "lucide-react"
import "../Chatbox/Chatbox.css"
import { Conversation } from "./type"
import { ALL_CONVERSATIONS } from "../../hooks/auth/chat/constants"
import api from "../../API/API"
import socket from "../../Utils/socket"
import { formatDate } from "../../Utils/formatDate"
import ConversationDetail from "../Conversation_Details/ConversationDetail"
import { useNavigate } from "react-router-dom"



export default function ChatBox() {
    const [searchQuery, setSearchQuery] = useState("")
    const [conversationsAll, setConversationsAll] = useState<Conversation[]>([])
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
    console.log(onlineUsers)
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)

    const userInfo = localStorage.getItem("userInfo");
    const token = userInfo ? JSON.parse(userInfo).token : null;
    const navigate = useNavigate();
    const currentUserId = userInfo ? JSON.parse(userInfo).id : null;
    const handleClickConversation = (id: string) => {
        navigate(`/chat/${id}`);
    };

    // Load online users from API
    const loadOnlineUsers = async () => {
        try {
            const response = await api.get('/user/online-status', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.httpStatusCode === 200) {
                const onlineUserIds = response.data.data.users
                    .filter((user: any) => user.isOnline)
                    .map((user: any) => user._id);

                setOnlineUsers(new Set(onlineUserIds));
            }
        } catch (error) {
            console.error('Error loading online users:', error);
        }
    };

    // Check if user is online
    const isUserOnline = (userId: string) => {
        return onlineUsers.has(userId);
    };

    // Get conversation online status
    const getConversationOnlineStatus = (conversation: Conversation) => {
        if (conversation.type === "group") {
            const onlineParticipants = conversation.participants?.filter(p =>
                p._id !== currentUserId && isUserOnline(p._id)
            ) || [];
            return {
                hasOnlineUsers: onlineParticipants.length > 0,
                onlineCount: onlineParticipants.length,
                totalCount: conversation.participants?.length || 0
            };
        } else {
            const otherUser = conversation.participants?.find(p => p._id !== currentUserId);
            return {
                hasOnlineUsers: otherUser ? isUserOnline(otherUser._id) : false,
                onlineCount: otherUser && isUserOnline(otherUser._id) ? 1 : 0,
                totalCount: 1
            };
        }
    };

    useEffect(() => {
        const getAll_conversations = async () => {
            try {
                const res = await api.get(ALL_CONVERSATIONS, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = res.data.data;

                setConversationsAll(data);
            } catch (error) {
                console.error("Lỗi khi lấy conversation:", error);
            }
        }

        getAll_conversations();
        loadOnlineUsers();
    }, [])

    // Listen for online status changes
    useEffect(() => {
        const handleUserOnline = (event: CustomEvent) => {
            console.log('User online:', event.detail);
            setOnlineUsers(prev => new Set([...prev, event.detail.userId]));
        };

        const handleUserOffline = (event: CustomEvent) => {
            console.log('User offline:', event.detail);
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(event.detail.userId);
                return newSet;
            });
        };

        window.addEventListener('userOnline', handleUserOnline as EventListener);
        window.addEventListener('userOffline', handleUserOffline as EventListener);

        return () => {
            window.removeEventListener('userOnline', handleUserOnline as EventListener);
            window.removeEventListener('userOffline', handleUserOffline as EventListener);
        };
    }, []);

    const updateConversationPreview = (message: any) => {
        setConversationsAll((prevConvs) => {
            const updated = prevConvs.map((conv) => {
                const isMatch = String(conv._id) === String(message.conversation);
                if (!isMatch) return conv;
                const senderId = (message.sender && (message.sender._id || message.sender)) || undefined;
                const isMine = String(senderId) === String(currentUserId);
                const unread = !isMine
                    ? ((conv.unreadCount as any) || 0) + 1
                    : 0; //
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
                (a, b) => new Date(a.timestamp || a.createdAt || 0).getTime() - new Date(b.timestamp || b.createdAt || 0).getTime()
            ).reverse();
        });
    };

    useEffect(() => {
        const handleNewMessagePreview = (message: any) => {
            updateConversationPreview(message);
        };
        socket.on("newMessagePreview", handleNewMessagePreview);
        return () => {
            socket.off("newMessagePreview", handleNewMessagePreview);
        };
    }, []);

    return (
        <div className="messaging-app">
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-title">
                        <h1>Tin nhắn</h1>
                        <button className="menu-button">
                            <MoreVertical size={20} />
                        </button>
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

                {/* Conversations List */}
                <div className="conversations-list">
                    {conversationsAll?.map((conversation, index) => {
                        const isGroup = conversation.type === "group";
                        const onlineStatus = getConversationOnlineStatus(conversation);

                        const otherUser = isGroup
                            ? null
                            : conversation.participants?.find((p) => p._id !== currentUserId);

                        const displayName = isGroup ? conversation.name : otherUser?.username;

                        const lastSenderId = (conversation as any).lastMessage?.sender?._id || (conversation as any).lastMessage?.sender;
                        const isMyLast = String(lastSenderId) === String(currentUserId);
                        const previewPrefix = isMyLast ? "Bạn: " : "";
                        const isUnread = !isMyLast && ((conversation.unreadCount as any) || 0) > 0;

                        return (
                            <div
                                key={index}
                                className={`conversation-item ${currentConversation?._id === conversation._id ? "active" : ""
                                    }`}
                                onClick={() => handleClickConversation(conversation._id)}
                            >
                                <div className="avatar-container">
                                    {isGroup ? (
                                        <div className={`group-avatar group-${Math.min(conversation.participants?.length || 0, 4)}`}>
                                            {conversation.participants?.slice(0, 4).map((participant, idx) => (
                                                <img
                                                    key={participant._id}
                                                    src={participant.avatar || "/placeholder.svg"}
                                                    alt={participant.username}
                                                    className={`slot slot-${idx + 1}`}
                                                />
                                            ))}
                                            {conversation.participants && conversation.participants.length > 4 && (
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
                                            {formatDate((conversation as any).lastMessage?.createdAt || conversation.createdAt || new Date())}
                                        </span>
                                    </div>
                                    <p className="conversation-preview" style={{ fontWeight: isUnread ? 800 : 400 }}>
                                        {previewPrefix}{(conversation as any).lastMessage?.content}
                                    </p>
                                    {isGroup && onlineStatus.hasOnlineUsers && (
                                        <div className="online-info">
                                            {onlineStatus.onlineCount} thành viên online
                                        </div>
                                    )}
                                </div>

                                {(conversation.unreadCount ?? 0) > 0 && (
                                    <div className="unread-badge">{conversation.unreadCount}</div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>

            <ConversationDetail />

        </div >
    )
}
