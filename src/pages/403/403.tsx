import React from "react";
import { useNavigate } from "react-router-dom";
import "./403.css"; // import file css thuần

const Forbidden403: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/"); // quay lại trang chủ
  };

  return (
    <div className="forbidden-page">
      <div className="forbidden-box">
        <div className="forbidden-icon">🚫</div>
        <h1 className="forbidden-code">403</h1>
        <h2 className="forbidden-title">Không có quyền truy cập</h2>
        <p className="forbidden-message">
          Bạn không có quyền truy cập vào nội dung này.<br />
          Vui lòng liên hệ quản trị viên hoặc quay lại trang chính.
        </p>

        <button className="forbidden-btn" onClick={handleBack}>
          ← Quay lại trang chủ
        </button>
      </div>
    </div>
  );
};

export default Forbidden403;
