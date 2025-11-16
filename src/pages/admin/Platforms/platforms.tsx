"use client";

import { useEffect, useState } from "react";
import "./platforms.css";
import { disconnectPlatform } from "../../../hooks/auth/platform/useDisconnect";
import { connectPlatform } from "../../../hooks/auth/platform/useConnect";
import { LoadingModal } from "../../../components/Loading/ModalLoading";
import usePlatformStatus from "../../../hooks/auth/platform/usePlatformStatus";

export default function Platforms() {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { platforms, loading: loadingPlatforms ,refetch} = usePlatformStatus();
  console.log(platforms);
 
  const [showModal, setShowModal] = useState(false);
  const [newPlatform, setNewPlatform] = useState({ name: "", apiKey: "" });

  //   if (!newPlatform.name || !newPlatform.apiKey) return;

  //   try {
  //     setLoading(true);
  //     await connectPlatform(newPlatform.name, newPlatform.apiKey);

  //     // Không cần setPlatforms — socket sẽ emit platform-status khi BE xong
  //     setNewPlatform({ name: "", apiKey: "" });
  //     setShowModal(false);
  //   } catch (err) {
  //     console.error("❌ Lỗi khi thêm platform:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleAddPlatform = async () => {
    if (!newPlatform.name || !newPlatform.apiKey) return;
    try {
      setLoading(true);
      const addedPlatform = await connectPlatform(
        newPlatform.name,
        newPlatform.apiKey
      );

      // ✅ Cập nhật danh sách trực tiếp
      setPlatforms((prev) => [
        ...prev,
        {
          id: addedPlatform.id ?? Date.now(), // phòng khi BE không trả id
          name: newPlatform.name,
          users: 0,
          messages: 0,
          status: "connected",
        },
      ]);

      setNewPlatform({ name: "", apiKey: "" });
      setShowModal(false);
    } catch (err) {
      console.error("❌ Lỗi khi thêm platform:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlatform = async (id: number, name: string) => {
    try {
      setLoading(true);
      await disconnectPlatform(name, id);
    } catch (err) {
      console.error("❌ Lỗi khi xóa platform:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    const platform = platforms.find((p) => p._id === id || p._doc?._id === id);
    console.log(platform)
    if (!platform) return;

    setLoadingId(id);
    setLoading(true);
    try {
      const currentStatus = platform.status || platform._doc?.status;
      const platformName = platform.name || platform._doc?.name;

      if (currentStatus === "connected") {
        await disconnectPlatform(platformName, id);
      } else {
        await connectPlatform(platformName, id);
      }

      // ✅ Refetch lại danh sách từ DB
      await refetch();

    } catch (err) {
      console.error("❌ Lỗi khi toggle:", err);
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
        {platforms?.map((platform, index) => (
          <div key={index} className="platform-card">
            <div className="platform-header">
              <h3>{platform._doc.name}</h3>
              <span className={`status-badge ${platform._doc.name}`}>
                {platform._doc.status}
              </span>
            </div>
            <div className="platform-stats">
              <div className="stat">
                <span className="stat-label">Users</span>
                <span className="stat-value">{platform.totalUsers}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Messages</span>
                <span className="stat-value">{platform.totalMessages}</span>
              </div>
            </div>
            <div className="platform-actions">
            
              <button
                className={`btn-secondary ${
                  platform._doc.status === "connected" ? "btn-danger" : ""
                }`}
                onClick={() => handleToggleStatus(platform._id || platform._doc._id)}
                disabled={loadingId === platform._doc.id}
              >
                {loadingId === platform._doc.id
                  ? platform._doc.status === "connected"
                    ? "Disconnecting..."
                    : "Connecting..."
                  : platform._doc.status === "connected"
                  ? "Disconnect"
                  : "Connect"}
              </button>

              <button
                className="btn-icon delete"
                onClick={() => handleDeletePlatform(platform.id, platform.name)}
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
