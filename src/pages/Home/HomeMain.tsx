
import React, { useEffect } from 'react';
import {
  MessageCircle,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Zap,
  Users,
  Shield,
  ArrowRight,
  Code,
  Layout
} from "lucide-react";
import { Link } from "react-router-dom";
import "./HomeMain.css";

export default function HomeMain() {
  const user = JSON.parse(localStorage.getItem("userInfo") || "null");


useEffect(() => {
  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        } else {
          entry.target.classList.remove("active");
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}, []);

  return (
    <main className="home-main">
      {/* Background Glow Blobs */}
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>

      {/* Header */}
    

      {/* Hero Section */}
      <section className="hero-section reveal">
        <div className="hero-content">
          <h1 className="hero-title">
            Hệ thống chat <br/>
            <span className="text-gradient">đa nền tảng thế hệ mới</span>
          </h1>
          <p className="hero-description">
            Kết nối liền mạch mọi cuộc trò chuyện từ Web, Mobile đến Desktop. 
            Giải pháp giao tiếp Unified Communication bảo mật và tốc độ cao.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="hero-primary-button">
              Dùng ngay
            </Link>
            {/* <button className="hero-secondary-button">
              Xem demo
              <ArrowRight size={18} />
            </button> */}
          </div>

          <div className="hero-platforms">
            <div className="hero-platform-item">
              <Monitor size={24} />
              <span>Web</span>
            </div>
            <div className="hero-platform-item">
              <Smartphone size={24} />
              <span>Mobile</span>
            </div>
            <div className="hero-platform-item">
              <Tablet size={24} />
              <span>Tablet</span>
            </div>
            <div className="hero-platform-item">
              <Code size={24} />
              <span>API</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section reveal">
        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-number">99.9%</div>
            <div className="stats-label">Uptime</div>
            <div className="stats-description">Cam kết hoạt động ổn định</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">5+</div>
            <div className="stats-label">Platforms</div>
            <div className="stats-description">Web, iOS, Android, Desktop...</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">50ms</div>
            <div className="stats-label">Latency</div>
            <div className="stats-description">Tốc độ phản hồi thời gian thực</div>
          </div>
          <div className="stats-card">
            <div className="stats-number">24/7</div>
            <div className="stats-label">Support</div>
            <div className="stats-description">Đội ngũ kỹ thuật túc trực</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-container reveal">
        <div className="section-grid">
          <div>
            <div className="feature-badge">
              <Zap size={16} /> Tính năng nổi bật
            </div>
            <h2 className="section-title">
              Kết nối mọi điểm chạm. <br/>
              <span className="text-gradient">Trải nghiệm đồng nhất.</span>
            </h2>
            <p className="section-desc">
              Không còn lo lắng về việc tin nhắn bị trễ hay mất đồng bộ. 
              Hệ thống của chúng tôi tự động sync dữ liệu giữa các thiết bị ngay lập tức.
            </p>
          </div>
          
          <div className="feature-list">
            <div className="feature-item">
              <Users className="text-blue" size={32} />
              <div>
                <div className="feature-text">Đồng bộ Real-time</div>
                <div style={{fontSize: 14, color: '#a1a1aa'}}>Cập nhật tin nhắn ngay lập tức trên mọi thiết bị.</div>
              </div>
            </div>
            <div className="feature-item">
              <Shield className="text-purple" size={32} />
              <div>
                <div className="feature-text">Bảo mật End-to-End</div>
                <div style={{fontSize: 14, color: '#a1a1aa'}}>Mã hóa đầu cuối đảm bảo riêng tư tuyệt đối.</div>
              </div>
            </div>
            <div className="feature-item">
              <Layout className="text-green" size={32} />
              <div>
                <div className="feature-text">Giao diện tùy biến</div>
                <div style={{fontSize: 14, color: '#a1a1aa'}}>Dễ dàng tích hợp vào website có sẵn của bạn.</div>
              </div>
            </div>
            <div className="feature-item">
              <Globe className="text-yellow" size={32} />
              <div>
                <div className="feature-text">Hỗ trợ đa ngôn ngữ</div>
                <div style={{fontSize: 14, color: '#a1a1aa'}}>Tự động dịch thuật tin nhắn cho khách hàng quốc tế.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Support Section */}
      <section  className="section-container reveal">
        <div style={{textAlign: 'center', maxWidth: 800, margin: '0 auto'}}>
          <h2 className="section-title">Hỗ trợ mọi nền tảng kỹ thuật</h2>
          <p className="section-desc">
            Cung cấp SDK và API mạnh mẽ cho lập trình viên để tích hợp Chat vào bất kỳ hệ thống nào.
          </p>
        </div>

        <div className="platform-grid reveal">
          <div className="platform-card">
            <Monitor className="text-blue" size={48} style={{margin: '0 auto 20px'}} />
            <h3 className="platform-title">Web Application</h3>
            <p style={{color: '#a1a1aa'}}>Tương thích hoàn hảo với React, Vue, Angular và Next.js.</p>
          </div>
          <div className="platform-card">
            <Smartphone className="text-green" size={48} style={{margin: '0 auto 20px'}} />
            <h3 className="platform-title">Mobile Apps</h3>
            <p style={{color: '#a1a1aa'}}>SDK Native cho iOS (Swift), Android (Kotlin) và React Native.</p>
          </div>
          <div className="platform-card">
            <Code className="text-purple" size={48} style={{margin: '0 auto 20px'}} />
            <h3 className="platform-title">RESTful API</h3>
            <p style={{color: '#a1a1aa'}}>API tài liệu đầy đủ, dễ dàng tích hợp vào hệ thống backend có sẵn.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-container reveal">
        <div className="cta-box">
          <div className="cta-glow"></div>
          <h2 className="section-title">Sẵn sàng nâng tầm doanh nghiệp?</h2>
          <p className="section-desc" style={{maxWidth: 600, margin: '0 auto 30px'}}>
            Trải nghiệm hệ thống chat đa nền tảng số 1 hiện nay. 
            Đăng ký ngay để nhận 30 ngày dùng thử Full tính năng.
          </p>
          <div className="hero-buttons" style={{marginBottom: 0}}>
            <Link to="/chat" className="hero-primary-button">
              Bắt đầu ngay
            </Link>
            <button className="hero-secondary-button">Liên hệ Sales</button>
          </div>
        </div>
      </section>

      <footer style={{textAlign: 'center', padding: '40px', color: '#52525b', borderTop: '1px solid rgba(255,255,255,0.05)'}}>
        <p>© 2025 MultiChat Inc. All rights reserved.</p>
      </footer>
    </main>
  );
}