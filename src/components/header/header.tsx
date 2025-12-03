import { MessageCircle } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

export default function Header() {
    const userInfo = localStorage.getItem("userInfo");
    const user = userInfo ? JSON.parse(userInfo) : null;
    console.log(user)
    return (
         <header className="home-header">
        <div className="header-container">
          <Link to="/" className="header-logo">
            <MessageCircle className="header-logo-icon" size={32} />
            <span>MultiChat</span>
          </Link>

          <nav className="header-nav">
              <Link to="/features" className="header-nav-link">Tính năng</Link>
              <Link to="/platforms" className="header-nav-link">Nền tảng</Link>
               <Link to="/pricing" className="header-nav-link">Giá cả</Link>
          </nav>

          {user ? (
            <div className="header-user-menu">
              <button className="header-username">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> {/* Online dot */}
                👋 {user.username}
              </button>
              <div className="header-user-dropdown">
                <Link to="/infoStaff" className="dropdown-item">
                  Thông tin cá nhân
                </Link>
                 <Link to="/ChatBox" className="dropdown-item">
                  Đoạn chat
                </Link>
                 {user.role === "admin" && (
        <Link to="/admin" className="dropdown-item">
          Dashboard
        </Link>
      )}
                <button
                  className="dropdown-item"
                  onClick={() => {
                    localStorage.removeItem("userInfo");
                    window.location.href = "/login";
                  }}
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="header-cta-button">
              Đăng nhập
            </Link>
          )}
        </div>
      </header>
    )
}
