// 🧩 Đặt ở đầu file, phía trên export default function ConversationDetail()
// hoặc tách ra file riêng ContentMessage.tsx nếu bạn thích

import React, { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { formatDate } from "../../Utils/formatDate";

export const ContentMessage = memo(function ContentMessage({
    messages,
    myId,
    currentConversation,
    lastReadAt,
    containerRef,
}: any) {
    const lastIndex = messages.length - 1;
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    return (
        <div className="messages-container" ref={containerRef}>
            {messages?.map((msg: any, index: number) => {
                const senderId = msg.sender?._id 
                const isMe = senderId === myId || msg.sender?.role=== "assistant";
                const senderInfo = currentConversation?.participants?.find((p: any) => p._id === senderId);

                return (
                    <div key={msg._id} className={`message-group ${isMe ? "message-sent" : "message-received"}`}>
                        <div className="message-content">
                            {!isMe && (
                                <img
                                    src={senderInfo?.avatar || "/placeholder.svg"}
                                    alt={senderInfo?.username || "User"}
                                    className="message-avatar"
                                />
                            )}
                            <div className="message-bubble-container">
                                <div className="message-bubble">
                                    {/* {msg.type === "text" && (
                                        <div
                                            className="message-text"
                                            dangerouslySetInnerHTML={{
                                                __html: marked.parse(
                                                    typeof msg.content === "string"
                                                        ? msg.content
                                                        : JSON.stringify(msg.content.text || msg.content)
                                                ),
                                            }}

                                        />
                                    )} */}
                                    {msg.type === "text" && (
                                        <div className="message-text">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    img: ({ node, ...props }) => (
                                                        <img
                                                            {...props}
                                                            onClick={() => setPreviewImage(props.src || "")} // 🧩 click phóng to
                                                            style={{
                                                                maxWidth: "220px",
                                                                borderRadius: "10px",
                                                                marginTop: "6px",
                                                                cursor: "zoom-in",
                                                                transition: "0.2s",
                                                            }}
                                                            alt={props.alt || "image"}
                                                        />
                                                    ),
                                                }}
                                            >
                                                {typeof msg.content === "string"
                                                    ? msg.content
                                                    : msg.content?.text || ""}
                                            </ReactMarkdown>
                                        </div>
                                    )}

                                    {msg.type === "image" && (
                                        <img
                                            onClick={() => setPreviewImage(msg.content)}
                                            src={msg.content}
                                            alt="sent image"
                                            className="message-image"
                                            style={{ maxWidth: "200px", borderRadius: "8px" }}
                                        />
                                    )}
                                    {msg.type === "file" && (
                                        <a href={msg.content} target="_blank" rel="noopener noreferrer" className="message-file">
                                            {msg.fileName || "Tải file"}
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
                );
            })}
            {previewImage && (
                <div
                    className="image-modal"
                    onClick={() => setPreviewImage(null)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.8)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                        cursor: "zoom-out",
                    }}
                >
                    <img
                        src={previewImage}
                        alt="preview"
                        style={{
                            maxWidth: "90%",
                            maxHeight: "90%",
                            borderRadius: "10px",
                            boxShadow: "0 0 20px rgba(255,255,255,0.3)",
                        }}
                    />
                </div>
            )}
        </div>
    );
});
