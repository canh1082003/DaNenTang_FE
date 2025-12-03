"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { getToken } from "../../Utils/getToken";
import { SEARCH_USER } from "../../hooks/auth/user/constant";
import api from "../../API/API";
import { ADD_MEMBER } from "../../hooks/auth/Conversation/constants";
import { AddMemberModalProps, UserItem } from "./type";

export default function AddMemberModal({
  conversationId,
  onClose,
  members,
}: AddMemberModalProps) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    try {
      setLoading(true);
      const token = getToken();

      const res = await api.get(`${SEARCH_USER}?keyword=${keyword}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allUsers: UserItem[] = res.data.data || [];
      console.log(allUsers)
      const memberIds = members.map((m) => m._id);

      const filtered = allUsers.filter((u) => !memberIds.includes(u._id));

      setResults(filtered);
    } catch (err) {
      toast.error("Không thể tìm người!");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (userId: string) => {
    try {
      await api.post(`${ADD_MEMBER}/${conversationId}/member`, {
        userIds: [userId],
      });

      toast.success("Đã thêm thành viên!");
      onClose(); // đóng modal
    } catch (err) {
      toast.error("Không thể thêm người!");
    }
  };

  return (
    <div className="add-member-form">
      <input
        type="text"
        className="input-member"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Nhập tên hoặc email để tìm..."
      />

      <button onClick={handleSearch} className="add-btn">
        {loading ? "Đang tìm..." : "Tìm"}
      </button>

      <button onClick={onClose} className="cancel-btn">
        Hủy
      </button>

      {results.length > 0 && (
        <div className="search-results">
          {results.map((user) => (
            <div key={user._id} className="search-item">
              <img src={user.avatar} className="avatar" />
              <div className="info">
                <p>{user.username}</p>
              </div>
              <button
                onClick={() => handleAdd(user._id)}
                className="select-btn"
              >
                Thêm
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
