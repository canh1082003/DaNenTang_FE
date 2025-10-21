"use client";

import { useEffect, useState } from "react";
import "./platforms.css";
import { disconnectPlatform } from "../../../hooks/auth/platform/useDisconnect";
import { connectPlatform } from "../../../hooks/auth/platform/useConnect";
import { LoadingSpinner } from "../../../components/Loading/LoadingSpinner";
import { LoadingModal } from "../../../components/Loading/ModalLoading";
import io from "socket.io-client";

const url_ngrok =import.meta.env.VITE_API_URL

const socket = io(url_ngrok!, {
  transports: ["websocket"],
});
export default function Platforms() {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [platforms, setPlatforms] = useState([
    {
      id: 1,
      name: "Facebook",
      status: "connected",
      users: 1250,
      messages: 5420,
    },
    { id: 4, name: "Telegram", status: "disconnected", users: 0, messages: 0 },
  ]);
  useEffect(() => {
  socket.on("connect", () => {
    console.log("✅ Connected to backend via socket:", socket.id);

    const userInfo = localStorage.getItem("userInfo");
    const userId = userInfo ? JSON.parse(userInfo).id : null;
    if (userId) {
      socket.emit("setup", userId);
      console.log("Setup socket cho user:", userId);
    }
  });

  // Lắng nghe update từ server
  socket.on("platform-status", (data: { name: string; status: string }) => {
    console.log("📡 Received platform update:", data);

    // Cập nhật state platform tương ứng
    setPlatforms((prev) =>
      prev.map((p) =>
        p.name.toLowerCase() === data.name.toLowerCase()
          ? { ...p, status: data.status }
          : p
      )
    );
  });

  socket.on("disconnect", () => {
    console.warn("⚠️ Socket disconnected");
  });

  // Cleanup
  return () => {
    socket.off("platform-status");
    socket.off("connect");
    socket.off("disconnect");
  };
}, []);

  const [showModal, setShowModal] = useState(false);
  const [newPlatform, setNewPlatform] = useState({ name: "", apiKey: "" });

  const handleAddPlatform = () => {
    if (newPlatform.name && newPlatform.apiKey) {
      setPlatforms([
        ...platforms,
        {
          id: platforms.length + 1,
          name: newPlatform.name,
          status: "connected",
          users: 0,
          messages: 0,
        },
      ]);
      setNewPlatform({ name: "", apiKey: "" });
      setShowModal(false);
    }
  };

  const handleDeletePlatform = (id: number) => {
    setPlatforms(platforms.filter((p) => p.id !== id));
  };

  const handleToggleStatus = async (id: number) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform) return;
    setLoading(true);
    try {
      if (platform.status === "connected") {
        await disconnectPlatform(platform.name, id);
      } else {
        await connectPlatform(platform.name, id);
      }

      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                status: p.status === "connected" ? "disconnected" : "connected",
              }
            : p
        )
      );
    } catch (error) {
      console.error("Lỗi khi toggle:", error);
    } finally {
      setLoadingId(null);
      setLoading(false);
    }
  };

  return (
    <div className="platforms-page">
      <div className="page-header">
        <h1>Platforms</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Platform
        </button>
      </div>

      <div className="platforms-grid">
        {platforms.map((platform) => (
          <div key={platform.id} className="platform-card">
            <div className="platform-header">
              <h3>{platform.name}</h3>
              <span className={`status-badge ${platform.status}`}>
                {platform.status}
              </span>
            </div>
            <div className="platform-stats">
              <div className="stat">
                <span className="stat-label">Users</span>
                <span className="stat-value">{platform.users}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Messages</span>
                <span className="stat-value">{platform.messages}</span>
              </div>
            </div>
            <div className="platform-actions">
              <button
                className="btn-secondary"
                onClick={() => handleToggleStatus(platform.id)}
                disabled={loadingId === platform.id}
              >
                {loadingId === platform.id
                  ? platform.status === "connected"
                    ? "Disconnecting..."
                    : "Connecting..."
                  : platform.status === "connected"
                  ? "Disconnect"
                  : "Connect"}
              </button>

              <button
                className="btn-icon delete"
                onClick={() => handleDeletePlatform(platform.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
      <LoadingModal show={loading} text="Đang xử lý kết nối..." />

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Platform</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Platform Name</label>
                <select
                  value={newPlatform.name}
                  onChange={(e) =>
                    setNewPlatform({ ...newPlatform, name: e.target.value })
                  }
                >
                  <option value="">Select platform</option>
                  <option value="Facebook">Facebook</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Telegram">Telegram</option>
                  <option value="Twitter">Twitter</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>
              </div>
              <div className="form-group">
                <label>API Key</label>
                <input
                  type="password"
                  placeholder="Enter API key"
                  value={newPlatform.apiKey}
                  onChange={(e) =>
                    setNewPlatform({ ...newPlatform, apiKey: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddPlatform}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
