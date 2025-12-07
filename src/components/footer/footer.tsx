import React from "react";
import "./footer.css"; // import file css riêng

export default function Footer() {
  return (
    <footer className="footer_main">
      <div className="footer-container">

        {/* Logo + Slogan */}
        <div className="footer-section">
          <h2 className="footer-logo">MultiChat</h2>
          <p className="footer-text">
            Giải pháp giao tiếp đa nền tảng thế hệ mới.  
            Kết nối Web – Mobile – Desktop với tốc độ và bảo mật hàng đầu.
          </p>
        </div>

        {/* Links */}
        <div className="footer-section">
          <h3 className="footer-title">Liên kết nhanh</h3>
          <ul className="footer-links">
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/features">Tính năng</a></li>
            <li><a href="/pricing">Giá cả</a></li>
            <li><a href="/docs">Tài liệu API</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3 className="footer-title">Liên hệ</h3>
          <p className="footer-text"><strong>Tên:</strong> Nguyễn Công Anh</p>
          <p className="footer-text"><strong>Email:</strong> nguyenconganhdev@gmail.com</p>
          <p className="footer-text"><strong>SĐT:</strong> 0775 500 478</p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} MultiChat. All rights reserved.
      </div>
    </footer>
  );
}
