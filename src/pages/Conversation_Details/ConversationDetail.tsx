import React, { useEffect, useState, useRef } from 'react'
import { Search, Phone, Video, MoreVertical, Send, Paperclip, Smile, ArrowLeft } from "lucide-react"
import api from '../../API/API';
import { GET_FULL_CONVERSATION } from '../../hooks/auth/chat/constants';
import { Conversation, Message } from '../Chatbox/type';
import { useParams } from 'react-router-dom';
import { formatDate } from '../../Utils/formatDate';
import './Conversation_Details.css';
import socket from '../../Utils/socket';
import { useJoinConversation } from '../../hooks/Chat/useJoinConversation';
import { useConversationDetails } from '../../hooks/Chat/useConversationDetails';
import { useOnlineUsers } from '../../hooks/Chat/useOnlineUsers';
import { useUserStatusEvents } from '../../hooks/Chat/useUserStatusEvents';
import { useSocketMessages } from '../../hooks/Chat/useSocketMessages';
import { useSendMessage } from '../../hooks/Chat/useSendMessage';
import EmojiPicker from 'emoji-picker-react';

export default function ConversationDetail() {
    const [currentConversation, setCurrentConversation] = useState<Conversation | undefined>()
    const [messages, setMessages] = useState<Message[]>([])
    const [lastReadAt, setLastReadAt] = useState<string | undefined>(undefined);

    const userInfo = localStorage.getItem("userInfo");
    const token = userInfo ? JSON.parse(userInfo).token : null;
    const myId = userInfo ? JSON.parse(userInfo).id : null;
    const { conversationId } = useParams()

    const containerRef = useRef<HTMLDivElement | null>(null);
    const SCROLL_THRESHOLD_PX = 120;

    const getDistanceFromBottom = (): number => {
        const el = containerRef.current;
        if (!el) return 0;
        return el.scrollHeight - el.scrollTop - el.clientHeight;
    };

    const isNearBottom = (): boolean => {
        return getDistanceFromBottom() <= SCROLL_THRESHOLD_PX;
    };

    const scrollToBottom = () => {
        const el = containerRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight - el.clientHeight;
        }
    };
    useJoinConversation(conversationId);
    useConversationDetails(conversationId, token, setCurrentConversation, setMessages, scrollToBottom);
    useSocketMessages(conversationId, myId, isNearBottom, scrollToBottom, setMessages, setLastReadAt);
    const { onlineUsers, setOnlineUsers } = useOnlineUsers(token);
    useUserStatusEvents(setOnlineUsers);

    const { sendMessage } = useSendMessage(token);

    const [inputValue, setInputValue] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleSend = async () => {
        if (!inputValue.trim()) return;
        try {
            const formData = new FormData();
            formData.append("conversationId", conversationId || "");
            formData.append("type", "text");
            formData.append("content", inputValue);

            await sendMessage(formData);
            setInputValue(""); // clear sau khi gửi
        } catch (err) {
            console.error("Send failed", err);
        }
    };
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const isImage = file.type.startsWith("image/");

        const formData = new FormData();
        formData.append("conversationId", conversationId || "");
        formData.append("type", isImage ? "image" : "file");

        if (isImage) {
            formData.append("image", file); // đúng key "image"
        } else {
            formData.append("file", file); // đúng key "file"
        }

        try {
            await sendMessage(formData);
        } catch (err) {
            console.error("Send file failed", err);
        }
    };

    const onEmojiClick = (emojiObject: any) => {
        setInputValue((prev) => prev + emojiObject.emoji);
    };

    // Format trạng thái hoạt động
    const renderStatus = (userId: string) => {
        const lastSeen = onlineUsers.get(userId);

        if (lastSeen === null) return "Đang hoạt động";
        if (lastSeen instanceof Date && !isNaN(lastSeen.getTime())) {
            const diffMs = Date.now() - lastSeen.getTime();
            const diffMins = Math.floor(diffMs / 60000);

            if (diffMins < 1) return "Vừa mới hoạt động";
            if (diffMins < 60) return `Hoạt động ${diffMins} phút trước`;
            const diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24) return `Hoạt động ${diffHours} giờ trước`;
            const diffDays = Math.floor(diffHours / 24);
            return `Hoạt động ${diffDays} ngày trước`;
        }
        return "Không rõ";
    };

    // UI hiển thị tin nhắn
    const ContentMessage = () => {
        const lastIndex = messages.length - 1;
        return (
            <div className="messages-container" ref={containerRef}>
                {messages?.map((msg, index) => {
                    const senderId = (msg.sender && (msg.sender as any)._id) || undefined;
                    const isMe = senderId === myId;
                    const senderInfo = currentConversation?.participants?.find(p => p._id === senderId);

                    return (
                        <div key={msg._id} className={`message-group ${isMe ? "message-sent" : "message-received"}`}>
                            <div className="message-content">
                                {!isMe && (
                                    <img
                                        src={senderInfo?.avatar || "/placeholder.svg?height=32&width=32"}
                                        alt={senderInfo?.username || "User"}
                                        className="message-avatar"
                                    />
                                )}
                                <div className="message-bubble-container">
                                    {/* {senderInfo?.username} */}
                                    {/* <div className="message-bubble">
                                        <p className="message-text">{msg.content}</p>
                                    </div>
                                    <span className="message-time">
                                        {formatDate(msg.createdAt || currentConversation?.createdAt || new Date())}
                                    </span>
                                    {isMe && index === lastIndex && lastReadAt && (
                                        <div className="read-receipt">Đã xem {formatDate(lastReadAt)}</div>
                                    )} */}
                                    <div className="message-bubble">
                                        {msg.type === "text" && <p className="message-text">{msg.content}</p>}

                                        {msg.type === "image" && (
                                            <img
                                                src={msg.content}
                                                alt="sent image"
                                                className="message-image"
                                                style={{ maxWidth: "200px", borderRadius: "8px" }}
                                            />
                                        )}

                                        {msg.type === "file" && (
                                            <a
                                                href={msg.content}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="message-file"
                                            >
                                                📎 Tải file
                                            </a>
                                        )}
                                    </div>
                                    <span className="message-time">
                                        {formatDate(msg.createdAt || currentConversation?.createdAt || new Date())}
                                    </span>
                                    {isMe && index === lastIndex && lastReadAt && (
                                        <div className="read-receipt">Đã xem {formatDate(lastReadAt)}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    // render avatar cho header
    const renderHeaderAvatar = () => {
        if (!currentConversation) return null;

        if (currentConversation.type === "private") {
            const otherUser = currentConversation.participants.find(p => p._id !== myId);
            return (
                <div className="avatar-container">
                    <img
                        src={otherUser?.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={otherUser?.username || "User"}
                        className="avatar"
                    />
                    {renderStatus(otherUser?._id || "") === "Đang hoạt động" && (
                        <div className="online-indicator"></div>
                    )}
                </div>
            )
        } else {
            return (
                <div className="avatar-container">
                    <img
                        src={currentConversation.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={currentConversation.name}
                        className="avatar"
                    />
                </div>
            )
        }
    }

    return (
        <div className="chat-area">
            <div className="chat-header">
                <div className="chat-header-left">
                    <button className="back-button">
                        <ArrowLeft size={20} />
                    </button>
                    {renderHeaderAvatar()}
                    <div className="chat-user-info">
                        <h3>{currentConversation?.type === "private"
                            ? currentConversation.participants.find(p => p._id !== myId)?.username
                            : currentConversation?.name}
                        </h3>
                        {currentConversation?.type === "private" && currentConversation.participants
                            ? <p className="chat-user-status">
                                {renderStatus(currentConversation.participants.find(p => p._id !== myId)?._id || "")}
                            </p>
                            : <p className="chat-user-status">Nhóm</p>
                        }
                    </div>
                </div>
                <div className="chat-header-actions">
                    <button className="action-button"><Phone size={20} /></button>
                    <button className="action-button"><Video size={20} /></button>
                    <button className="action-button"><MoreVertical size={20} /></button>
                </div>
            </div>

            <ContentMessage />

            <div className="message-input-container">
                <div className="message-input-wrapper">
                    <button className="attachment-button" onClick={() => fileInputRef.current?.click()}><Paperclip size={20} /></button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        multiple
                        onChange={handleFileChange}
                    />
                    <div className="input-container" style={{ position: "relative" }}>
                        <input
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            className="message-input"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button className="emoji-button" onClick={() => setShowPicker((prev) => !prev)}><Smile size={16} /></button>

                        {showPicker && (
                            <div style={{ position: "absolute", bottom: "40px", right: 0 }}>
                                <EmojiPicker onEmojiClick={onEmojiClick} />
                            </div>
                        )}
                    </div>
                    <button className="send-button"><Send size={16} onClick={handleSend} /></button>
                </div>
            </div>
        </div>
    )
}
