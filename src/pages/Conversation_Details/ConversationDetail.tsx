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
import { useNavigate, useParams } from "react-router-dom";
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
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../API/API";
import {
  ADD_MEMBER,
  GET_CONVERSATION,
  LEAVE_CONVERSATION,
  REMOVE_MEMBER,
} from "../../hooks/auth/Conversation/constants";
import { getToken } from "../../Utils/getToken";
import { useCall } from "../../hooks/Call/useCall";
import { SEARCH_USER } from "../../hooks/auth/user/constant";
import AddMemberModal from "./SearchUser";

export default function ConversationDetail({
  chatType,
}: {
  chatType: "customer" | "staff";
}) {
  /** ---------------- STATE ---------------- */
  const [currentConversation, setCurrentConversation] =
    useState<Conversation>();
    console.log(currentConversation?.participants)
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastReadAt, setLastReadAt] = useState<string>();
  const [showSidebar, setShowSidebar] = useState(false);

  const [expandedSections, setExpandedSections] = useState<
    Record<SectionKey, boolean>
  >({
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
  const [isAddingMember, setIsAddingMember] = useState(false);
  // const [newMemberId, setNewMemberId] = useState("");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useJoinConversation(conversationId);
  useUserStatusEvents(setOnlineUsers);
  //  Rời khỏi nhóm
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const {
    incomingCall,
    inCall,
    startCall,
    acceptCall,
    declineCall,
    endCall,
    localVideoRef,
    remoteVideoRef,
  } = useCall(myId);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const token = getToken();
        if (!token) {
          toast.error("Bạn cần đăng nhập lại!");
          navigate("/login");
          return;
        }

        const res = await api.get(`${GET_CONVERSATION}/${conversationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res?.status === 500) {
          toast.warning("Bạn không có quyền truy cập đoạn chat này!");
          navigate("/");
        }
        setCurrentConversation(res?.data?.data);
      } catch (error: any) {
        console.log(error.response);
        if (error.response?.status === 500) {
          toast.warning("Bạn không có quyền truy cập đoạn chat này!");
          navigate("/"); // quay lại trang chính
        } else if (error.response?.status === 401) {
          toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
          navigate("/login");
        }
      }
    };
    if (conversationId) fetchConversation();
  }, [conversationId, navigate]);

  const handleLeaveGroup = async () => {
    if (!currentConversation?._id) return;
    const token = getToken();
    // Hiển thị modal xác nhận rời nhóm
    setModalConfig({
      title: "Xác nhận rời nhóm",
      message: "Bạn có chắc chắn muốn rời khỏi nhóm này không?",
      onConfirm: async () => {
        try {
          await api.delete(`${LEAVE_CONVERSATION}/${currentConversation._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          toast.success("Bạn đã rời nhóm thành công!");
          setCurrentConversation(undefined);
        } catch (err) {
          console.error(err);
          toast.error("Không thể rời nhóm, vui lòng thử lại!");
        }
      },
    });
    setShowConfirmModal(true);
  };

  // Thêm người vào nhóm
  const handleAddMember = async (userId: string) => {
    if (!currentConversation?._id) return;
    try {
      await api.post(`${ADD_MEMBER}/${currentConversation._id}/member`, {
        userIds: [userId],
      });
      toast.success("Đã thêm thành viên!");

      setSearchKeyword("");
      setSearchResults([]);
    } catch (err) {
      console.error(err);
      toast.error("Không thể thêm người, vui lòng thử lại!");
    }
  };
  const handleRemoveMember = async (userId: string) => {
    if (!currentConversation?._id) return;

    // Hiển thị modal xác nhận xóa thành viên
    setModalConfig({
      title: "Xác nhận xóa thành viên",
      message: "Bạn có chắc chắn muốn xóa người này khỏi nhóm không?",
      onConfirm: async () => {
        try {
          await api.delete(
            `${REMOVE_MEMBER}/${currentConversation._id}/member/${userId}`
          );

          setCurrentConversation({
            ...currentConversation,
            participants: currentConversation.participants.filter(
              (p: any) => p._id !== userId
            ),
          });

          toast.success("Đã xóa thành viên!");
        } catch (err) {
          console.error(err);
          toast.error("Không thể xóa người, vui lòng thử lại!");
        }
      },
    });
    setShowConfirmModal(true);
  };
  const handleSearchMember = async () => {
    if (!searchKeyword.trim()) {
      toast.info("Vui lòng nhập từ khoá!");
      return;
    }
    try {
      setIsSearching(true);
      const token = getToken();
      const res = await api.get(`${SEARCH_USER}?keyword=${searchKeyword}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchResults(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Không thể thêm người, vui lòng thử lại!");
    } finally {
      setIsSearching(false);
    }
  };
  const handleSelectUser = async (userId: string) => {
    try {
      await handleAddMember(userId); // hàm add member cũ của bạn
      toast.success("Đã thêm thành viên!");
      setSearchResults([]); // xoá list kết quả
      setSearchKeyword(""); // clear input
    } catch (err) {
      toast.error("Không thể thêm người này!");
    }
  };

  const confirmRemoveMember = async () => {
    if (!currentConversation?._id || !memberToRemove) return;

    try {
      await api.delete(
        `${api}/${currentConversation._id}/member/${memberToRemove}`
      );

      // Cập nhật lại state currentConversation để UI tự động cập nhật
      setCurrentConversation({
        ...currentConversation,
        participants: currentConversation.participants.filter(
          (p: any) => p._id !== memberToRemove
        ),
      });

      toast.success("Đã xóa thành viên!");
    } catch (err) {
      console.error(err);
      toast.error("Không thể xóa người, vui lòng thử lại!");
    } finally {
      setShowConfirmModal(false);
      setMemberToRemove(null);
    }
  };

  const cancelRemoveMember = () => {
    setShowConfirmModal(false);
    setMemberToRemove(null);
  };
  const confirmAction = async () => {
    await modalConfig.onConfirm();
    setShowConfirmModal(false);
  };
  const cancelAction = () => {
    setShowConfirmModal(false);
  };
  const ConfirmModal = () => {
    if (!showConfirmModal) return null;

    return (
      <div className="modal-overlay" onClick={cancelAction}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>{modalConfig.title}</h3>
          <p>{modalConfig.message}</p>
          <div className="modal-buttons">
            <button className="btn-cancel" onClick={cancelAction}>
              Hủy
            </button>
            <button className="btn-confirm" onClick={confirmAction}>
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    );
  };
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

  useConversationDetails(
    conversationId,
    token,
    setCurrentConversation,
    setMessages,
    scrollToBottom
  );
  useSocketMessages(
    conversationId,
    myId,
    isNearBottom,
    scrollToBottom,
    setMessages,
    setLastReadAt
  );

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

  const onEmojiClick = (emoji: any) =>
    setInputValue((prev) => prev + emoji.emoji);

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
      const otherUser = currentConversation.participants.find(
        (p) => p._id !== myId
      );
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
        <button
          className="attachment-button"
          onClick={() => fileInputRef.current?.click()}
        >
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
          <button
            className="emoji-button"
            onClick={() => setShowPicker((p) => !p)}
          >
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
        <button
          className="section-header"
          onClick={() => toggleSection(name as SectionKey)}
        >
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
          <button
            className="close-sidebar-btn"
            onClick={() => setShowSidebar(false)}
          >
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
          {currentConversation.type === "group" && (
            <Section
              name="members"
              label={`Thành viên (${currentConversation.participants.length})`}
            >
              <ul className="member-list">
                {currentConversation.participants.map((member: any) => (
                  <li key={member._id} className="member-item">
                    <span>{member.username || "Không tên"}</span>
                    {member._id !== myId && (
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveMember(member._id)}
                        title="Xóa khỏi nhóm"
                      >
                        XOÁ
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              {isAddingMember ? (
                <AddMemberModal
                conversationId={currentConversation?._id}
                members={currentConversation?.participants || []}
                  onClose={() => setIsAddingMember(false)}
                />
              ) : (
                <button
                  className="add-member-toggle"
                  onClick={() => setIsAddingMember(true)}
                >
                  ➕ Thêm người
                </button>
              )}
            </Section>
          )}
        </div>

        {currentConversation.type === "group" && (
          <div className="sidebar-footer">
            <button className="leave-btn" onClick={handleLeaveGroup}>
              🚪 Rời khỏi nhóm
            </button>
          </div>
        )}
        <ConfirmModal />
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
            <Link to="/ChatBox">
              <ArrowLeft size={20} />
            </Link>
          </button>
          {renderHeaderAvatar()}
          <div className="chat-user-info">
            <h3>
              {currentConversation?.type === "private"
                ? currentConversation.participants.find((p) => p._id !== myId)
                    ?.username
                : currentConversation?.name}
            </h3>
            {currentConversation?.assignedDepartment && (
              <div className="department-header">
                <span> Bộ phận: </span>
                <span
                  className={`department-badge ${currentConversation.assignedDepartment.toLowerCase()}`}
                >
                  {currentConversation.assignedDepartment.toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="chat-header-actions">
          {/* {chatType === "staff" && ( */}
          <>
            <button
              className="action-button"
              onClick={() => {
                const other = currentConversation?.participants.find(
                  (p) => p._id !== myId
                );
                if (other) startCall(other._id);
              }}
            >
              <Phone size={20} />
            </button>
            <button className="action-button">
              <Video size={20} />
            </button>
          </>
          {/* )} */}
          {incomingCall && (
            <div className="incoming-call-overlay">
              <div className="incoming-call-modal">
                <img
                  src={incomingCall.avatar || "https://i.imgur.com/6VBx3io.png"}
                  alt="avatar"
                  className="incoming-call-avatar"
                />

                <h2 className="incoming-call-name">
                  {incomingCall.username || "Ai đó"} đang gọi cho bạn...
                </h2>

                <div className="incoming-call-actions">
                  <button className="btn accept" onClick={acceptCall}>
                    Chấp nhận
                  </button>
                  <button className="btn decline" onClick={declineCall}>
                    Từ chối
                  </button>
                </div>
              </div>
            </div>
          )}

          {inCall && (
            <div className="call-screen">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className="local-video"
              />
              <video ref={remoteVideoRef} autoPlay className="remote-video" />

              <button className="end-call-btn" onClick={endCall}>
                Kết thúc
              </button>
            </div>
          )}

          <button
            className="action-button"
            onClick={() => setShowSidebar(!showSidebar)}
          >
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
                        setSelectedFiles((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        )
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
                        setSelectedFiles((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        )
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
