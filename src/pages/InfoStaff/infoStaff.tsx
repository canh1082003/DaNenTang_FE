import {
  Camera,
  Mail,
  User,
  Briefcase,
  Save,
  Shield,
  Hash,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import "./infoStaff.css";
import { useEffect, useState } from "react";
import { EditUserApi } from "../../hooks/auth/user/useEditUser";
import { toast } from "react-toastify";

export default function UserProfile() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo") || "null");
  });
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        department: user.department || "",
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          Không tìm thấy thông tin người dùng.
        </div>
      </div>
    );
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return;

    // Preview nhanh trước khi upload
    const previewURL = URL.createObjectURL(file)
    setUser(prev => ({ ...prev, avatar: previewURL }))

    // Chuẩn bị FormData gửi API
    const formDataUpload = new FormData()
    formDataUpload.append("avatar", file)

    try {
        const response = await EditUserApi(user.id, formDataUpload)

        // Server trả về link ảnh mới
        const newAvatar = response.data.avatar

        const updatedUser = {
            ...user,
            avatar: newAvatar
        }
        
        localStorage.setItem("userInfo", JSON.stringify(updatedUser))
        setUser(updatedUser)

        toast.success("Cập nhật ảnh thành công!")
    } catch (err) {
        console.error(err)
        toast.error("Cập nhật ảnh thất bại!")
    }
}

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      // Gọi API
      const response = await EditUserApi(user.id, formData);

      const updatedUser = { ...user, ...formData };

      // Cập nhật LocalStorage
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));

      setUser(updatedUser);

      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi update:", error);
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };
  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        {/* CỘT TRÁI: Avatar & System Info */}
        <div className="profile-sidebar">
          <div className="avatar-section">
            {/* <div className="avatar-wrapper">
              <img
                src={user.avatar || "https://github.com/shadcn.png"}
                alt="avatar"
                className="avatar-image"
              />
              <button className="avatar-edit-btn" title="Đổi ảnh đại diện">
                <Camera size={16} />
              </button>
            </div> */}
            <div className="avatar-wrapper">
              <img
                src={user.avatar || "https://github.com/shadcn.png"}
                alt="avatar"
                className="avatar-image"
              />

              <input
                type="file"
                id="avatarUpload"
                hidden
                accept="image/*"
                onChange={handleChangeAvatar}
              />

              <button
                className="avatar-edit-btn"
                title="Đổi ảnh đại diện"
                onClick={() => document.getElementById("avatarUpload")?.click()}
              >
                <Camera size={16} />
              </button>
            </div>

            <h2 className="profile-name">{user.username}</h2>
            <span className="profile-role">{user.role}</span>
          </div>

          <div className="system-info">
            <h3 className="sidebar-title">Thông tin hệ thống</h3>
            <div className="info-item">
              <Calendar size={16} className="info-icon" />
              <div className="info-content">
                <span className="label">Ngày tham gia</span>
                <span className="value">
                  {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
            <div className="info-item">
              <Shield size={16} className="info-icon" />
              <div className="info-content">
                <span className="label">Trạng thái Email</span>
                <span
                  className={`status-badge ${
                    user.isVerifyEmail ? "verified" : "pending"
                  }`}
                >
                  {user.isVerifyEmail ? (
                    <>
                      <CheckCircle size={12} /> Đã xác thực
                    </>
                  ) : (
                    <>
                      <XCircle size={12} /> Chưa xác thực
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: Form chỉnh sửa */}
        <div className="profile-main">
          <div className="main-header">
            <h1 className="main-title">Thông tin cá nhân</h1>
            <p className="main-subtitle">Quản lý thông tin hồ sơ của bạn</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Tên hiển thị</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Nhập tên hiển thị"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@gmail.com"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Phòng ban / Bộ phận</label>
              <div className="input-wrapper">
                <Briefcase size={18} className="input-icon" />
                <input
                  type="text"
                  name="department"
                  className="form-input"
                  value={formData.department || ""}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: IT, Marketing..."
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button onClick={handleSave} type="submit" className="btn-save">
              <Save size={18} /> Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
