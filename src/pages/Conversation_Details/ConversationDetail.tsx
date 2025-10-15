import React, { useState, useRef, useCallback, useEffect } from "react";
import {
    Phone,
    Video,
    MoreVertical,
    Send,
    Paperclip,
    Smile,
    ArrowLeft,
    X,
    ChevronDown,
    ChevronUp,
    ImageIcon,
    FileText,
} from "lucide-react";
import { useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

import type { Conversation, Message } from "../Chatbox/type";
import "./Conversation_Details.css";

import { ContentMessage } from "./ContentMessage";
import { useJoinConversation } from "../../hooks/Chat/useJoinConversation";
import { useConversationDetails } from "../../hooks/Chat/useConversationDetails";
import { useOnlineUsers } from "../../hooks/Chat/useOnlineUsers";
import { useUserStatusEvents } from "../../hooks/Chat/useUserStatusEvents";
import { useSocketMessages } from "../../hooks/Chat/useSocketMessages";
import { useSendMessage } from "../../hooks/Chat/useSendMessage";
import { SectionKey } from "./type";
import socket from "../../Utils/socket";

export default function ConversationDetail() {
    /** ---------------- STATE ---------------- */
    const [currentConversation, setCurrentConversation] = useState<Conversation>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [lastReadAt, setLastReadAt] = useState<string>();
    const [showSidebar, setShowSidebar] = useState(false);


    const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
        info: false,
        customize: false,
        media: false,
    });

    const [inputValue, setInputValue] = useState("");
    const [showPicker, setShowPicker] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    /** ---------------- REFS ---------------- */
    const fileInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const SCROLL_THRESHOLD_PX = 120;

    /** ---------------- AUTH ---------------- */
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const token = userInfo?.token || null;
    const myId = userInfo?.id || null;
    const { conversationId } = useParams();

    /** ---------------- HOOKS ---------------- */
    const { onlineUsers, setOnlineUsers } = useOnlineUsers(token);
    const { sendMessage } = useSendMessage(token);

    useJoinConversation(conversationId);
    useUserStatusEvents(setOnlineUsers);

    const getDistanceFromBottom = () => {
        const el = containerRef.current;
        if (!el) return 0;
        return el.scrollHeight - el.scrollTop - el.clientHeight;
    };

    const isNearBottom = () => getDistanceFromBottom() <= SCROLL_THRESHOLD_PX;

    const scrollToBottom = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;
        requestAnimationFrame(() => {
            el.scrollTo({ top: el.scrollHeight, behavior: "instant" });
        });
    }, []);
    useEffect(() => {
        if (!conversationId) return;

        const handleDepartmentUpdate = ({
            conversationId: updatedId,
            oldDepartment,
            newDepartment,
        }: {
            conversationId: string;
            oldDepartment: string;
            newDepartment: string;
        }) => {
            if (updatedId === conversationId) {
                console.log(
                    `[Realtime] Department updated for this conversation: ${oldDepartment} → ${newDepartment}`
                );

                // ✅ Cập nhật ngay bộ phận trong state
                setCurrentConversation((prev) =>
                    prev ? { ...prev, assignedDepartment: newDepartment } : prev
                );
            }
        };

        socket.on("departmentUpdated", handleDepartmentUpdate);

        return () => {
            socket.off("departmentUpdated", handleDepartmentUpdate);
        };
    }, [conversationId]);


    useConversationDetails(conversationId, token, setCurrentConversation, setMessages, scrollToBottom);
    useSocketMessages(conversationId, myId, isNearBottom, scrollToBottom, setMessages, setLastReadAt);

    /** ---------------- HANDLERS ---------------- */
    const toggleSection = (section: SectionKey) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
    };


    const handleSend = async () => {
        if (!inputValue.trim() && selectedFiles.length === 0) return;

        try {
            const formData = new FormData();
            formData.append("conversationId", conversationId || "");

            if (inputValue.trim()) formData.append("content", inputValue.trim());

            selectedFiles.forEach((file) =>
                file.type.startsWith("image/")
                    ? formData.append("image", file)
                    : formData.append("file", file)
            );

            await sendMessage(formData);
            setInputValue("");
            setSelectedFiles([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
            console.error("Send failed", err);
        }
    };

    const onEmojiClick = (emoji: any) => setInputValue((prev) => prev + emoji.emoji);

    /** ---------------- UI HELPERS ---------------- */
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

    const renderHeaderAvatar = () => {
        if (!currentConversation) return null;
        if (currentConversation.type === "group") {
            const otherUser = currentConversation.participants.find((p) => p._id !== myId);
            console.log(otherUser)
            return (
                <div className="avatar-container">
                    <img
                        src={otherUser?.avatar || "/placeholder.svg"}
                        alt={otherUser?.username || "User"}
                        className="avatar"
                    />
                    {renderStatus(otherUser?._id || "") === "Đang hoạt động" && (
                        <div className="online-indicator" />
                    )}
                </div>
            );
        }

        return (
            <div className="avatar-container">
                <img
                    src={currentConversation.avatar || "/placeholder.svg"}
                    alt={currentConversation.name}
                    className="avatar"
                />
            </div>
        );
    };

    /** ---------------- INPUT AREA ---------------- */
    const InputMessage = () => (
        <div className="message-input-container">
            <div className="message-input-wrapper">
                <button className="attachment-button" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip size={20} />
                </button>
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
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        onFocus={scrollToBottom}
                    />
                    <button className="emoji-button" onClick={() => setShowPicker((p) => !p)}>
                        <Smile size={16} />
                    </button>
                    {showPicker && (
                        <div style={{ position: "absolute", bottom: "40px", right: 0 }}>
                            <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                    )}
                </div>

                <button className="send-button" onClick={handleSend}>
                    <Send size={16} />
                </button>
            </div>
        </div>
    );

    /** ---------------- SIDEBAR ---------------- */
    const renderSidebar = () => {
        if (!showSidebar || !currentConversation) return null;

        const otherUser =
            currentConversation.type === "private"
                ? currentConversation.participants.find((p) => p._id !== myId)
                : null;

        const mediaMessages = messages.filter((m) => m.type === "image");
        const fileMessages = messages.filter((m) => m.type === "file");

        const Section = ({
            name,
            label,
            children,
        }: {
            name: string;
            label: string;
            children: React.ReactNode;
        }) => (
            <div className="sidebar-section">
                <button className="section-header" onClick={() => toggleSection(name as SectionKey)}>
                    <span>{label}</span>
                    {expandedSections[name as keyof typeof expandedSections] ? (
                        <ChevronUp size={20} />
                    ) : (
                        <ChevronDown size={20} />
                    )}
                </button>
                {expandedSections[name as keyof typeof expandedSections] && (
                    <div className="section-content">{children}</div>
                )}
            </div>
        );

        return (
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    <h3>Thông tin chi tiết</h3>
                    <button className="close-sidebar-btn" onClick={() => setShowSidebar(false)}>
                        <X size={20} />
                    </button>
                </div>

                <div className="sidebar-content">
                    <Section name="info" label="Thông tin về đoạn chat">
                        <div className="info-item">
                            <strong>Tên:</strong>
                            <span>
                                {currentConversation.type === "private"
                                    ? otherUser?.username
                                    : currentConversation.name}
                            </span>
                        </div>
                        {currentConversation.type === "group" && (
                            <div className="info-item">
                                <strong>Thành viên:</strong>
                                <span>{currentConversation.participants.length} người</span>
                            </div>
                        )}
                        <div className="info-item">
                            <strong>Trạng thái:</strong>
                            <span>
                                {currentConversation.type === "private"
                                    ? renderStatus(otherUser?._id || "")
                                    : "Nhóm"}
                            </span>
                        </div>

                    </Section>

                    <Section name="customize" label="Tùy chỉnh đoạn chat">
                        <div className="customize-option">Đổi tên đoạn chat</div>
                        <div className="customize-option">Thay đổi ảnh</div>
                        <div className="customize-option">Chọn biểu tượng cảm xúc</div>
                    </Section>

                    <Section name="media" label="File phương tiện & file">
                        <div className="media-subsection">
                            <div className="subsection-title">
                                <ImageIcon size={16} />
                                <span>File phương tiện ({mediaMessages.length})</span>
                            </div>
                            <div className="media-grid">
                                {mediaMessages.slice(0, 6).map((msg) => (
                                    <img
                                        key={msg._id}
                                        src={msg.content || "/placeholder.svg"}
                                        alt="media"
                                        className="media-thumbnail"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="media-subsection">
                            <div className="subsection-title">
                                <FileText size={16} />
                                <span>File ({fileMessages.length})</span>
                            </div>
                            <div className="file-list">
                                {fileMessages.slice(0, 5).map((msg) => (
                                    <a
                                        key={msg._id}
                                        href={msg.content}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="file-item"
                                    >
                                        <FileText size={16} />
                                        <span>{msg.fileName || "File"}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </Section>
                </div>
            </div>
        );
    };

    /** ---------------- RENDER ---------------- */
    return (
        <div className="chat-area">
            {/* HEADER */}
            <div className="chat-header">
                <div className="chat-header-left">
                    <button className="back-button">
                        <ArrowLeft size={20} />
                    </button>
                    {renderHeaderAvatar()}
                    <div className="chat-user-info">
                        <h3>
                            {currentConversation?.type === "private"
                                ? currentConversation.participants.find((p) => p._id !== myId)?.username
                                : currentConversation?.name}
                        </h3>
                        {/* <p className="chat-user-status">
                            {currentConversation?.type === "private"
                                ? renderStatus(
                                    currentConversation.participants.find((p) => p._id !== myId)?._id || ""
                                )
                                : "Nhóm"}
                        </p> */}
                        {currentConversation?.assignedDepartment && (
                            <div className="department-header">
                                <span> Bộ phận:{" "}</span>
                                <span className={`department-badge ${currentConversation.assignedDepartment.toLowerCase()}`}>
                                    {currentConversation.assignedDepartment.toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="chat-header-actions">
                    <button className="action-button">
                        <Phone size={20} />
                    </button>
                    <button className="action-button">
                        <Video size={20} />
                    </button>
                    <button className="action-button" onClick={() => setShowSidebar(!showSidebar)}>
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* MAIN CHAT AREA */}
            <div className="chat-main-content">
                <div className="chat-messages-area">
                    <ContentMessage
                        messages={messages}
                        myId={myId}
                        currentConversation={currentConversation}
                        lastReadAt={lastReadAt}
                        containerRef={containerRef}
                    />

                    {selectedFiles.length > 0 && (
                        <div className="preview-container">
                            {selectedFiles.map((file, i) =>
                                file.type.startsWith("image/") ? (
                                    <div key={i} className="image-preview">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="preview-image"
                                        />
                                        <button
                                            className="remove-file-btn"
                                            onClick={() =>
                                                setSelectedFiles((prev) => prev.filter((_, idx) => idx !== i))
                                            }
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <div key={i} className="file-preview-item">
                                        📎 {file.name}
                                        <button
                                            className="remove-file-btn-inline"
                                            onClick={() =>
                                                setSelectedFiles((prev) => prev.filter((_, idx) => idx !== i))
                                            }
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {InputMessage()}
                </div>

                {renderSidebar()}
            </div>
        </div>
    );
}
