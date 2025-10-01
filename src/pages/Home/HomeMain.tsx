
import { MessageCircle, Smartphone, Monitor, Tablet, Globe, Zap, Users, Shield, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import "./HomeMain.css"
export default function HomeMain() {
    return (
        <main className="home-main">
            {/* Header */}
            <header className="home-header">
                <div className="header-container">
                    <div className="header-logo">
                        <MessageCircle className="header-logo-icon" />
                        <span className="header-logo-text">MultiChat</span>
                    </div>
                    <nav className="header-nav">
                        <Link to="/features" className="header-nav-link">
                            Tính năng
                        </Link>
                        <Link to="/platforms" className="header-nav-link">
                            Nền tảng
                        </Link>
                        <Link to="/pricing" className="header-nav-link">
                            Giá cả
                        </Link>
                    </nav>
                    <Link to="/login" className="header-cta-button">
                        Đăng nhập
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Hệ thống chat <span className="hero-title-gradient">đa nền tảng</span>
                    </h1>
                    <p className="hero-description">
                        Kết nối mọi cuộc trò chuyện từ web, mobile đến desktop. Một nền tảng thống nhất cho tất cả các thiết bị và
                        ứng dụng của bạn.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/chat" className="hero-primary-button">
                            Dùng thử miễn phí
                        </Link>
                        <button className="hero-secondary-button">
                            Xem demo
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="hero-platforms">
                        <div className="hero-platform-item">
                            <Monitor className="hero-platform-icon" />
                            <span className="hero-platform-text">Web</span>
                        </div>
                        <div className="hero-platform-item">
                            <Smartphone className="hero-platform-icon" />
                            <span className="hero-platform-text">Mobile</span>
                        </div>
                        <div className="hero-platform-item">
                            <Tablet className="hero-platform-icon" />
                            <span className="hero-platform-text">Tablet</span>
                        </div>
                        <div className="hero-platform-item">
                            <Globe className="hero-platform-icon" />
                            <span className="hero-platform-text">API</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stats-card">
                        <div className="stats-number">99.9%</div>
                        <div className="stats-label">uptime đảm bảo</div>
                        <div className="stats-description">Độ tin cậy cao</div>
                    </div>
                    <div className="stats-card">
                        <div className="stats-number">5+</div>
                        <div className="stats-label">nền tảng hỗ trợ</div>
                        <div className="stats-description">Đa dạng thiết bị</div>
                    </div>
                    <div className="stats-card">
                        <div className="stats-number">50ms</div>
                        <div className="stats-label">độ trễ thấp</div>
                        <div className="stats-description">Thời gian thực</div>
                    </div>
                    <div className="stats-card">
                        <div className="stats-number">24/7</div>
                        <div className="stats-label">hỗ trợ kỹ thuật</div>
                        <div className="stats-description">Luôn sẵn sàng</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="features-grid">
                    <div className="features-content">
                        <div className="features-badge">
                            <Zap className="features-badge-icon" />
                            <span>Tính năng nổi bật</span>
                        </div>
                        <h2 className="features-title">
                            Kết nối mọi nền tảng. <span className="hero-title-gradient">Một trải nghiệm thống nhất.</span>
                        </h2>
                        <p className="features-description">
                            Từ web browser đến ứng dụng mobile, từ desktop đến API integration. Hệ thống chat của chúng tôi hoạt động
                            mượt mà trên mọi thiết bị và nền tảng.
                        </p>
                    </div>
                    <div className="features-card">
                        <h3 className="features-card-title">Tại sao chọn MultiChat?</h3>
                        <div className="features-list">
                            <div className="features-list-item">
                                <Users className="features-list-icon text-blue-400" />
                                <span className="features-list-text">Đồng bộ real-time trên mọi thiết bị</span>
                            </div>
                            <div className="features-list-item">
                                <Shield className="features-list-icon text-purple-400" />
                                <span className="features-list-text">Bảo mật end-to-end encryption</span>
                            </div>
                            <div className="features-list-item">
                                <Globe className="features-list-icon text-green-400" />
                                <span className="features-list-text">API mở cho tích hợp dễ dàng</span>
                            </div>
                            <div className="features-list-item">
                                <Zap className="features-list-icon text-yellow-400" />
                                <span className="features-list-text">Hiệu suất cao, độ trễ thấp</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Support Section */}
            <section id="platforms" className="platform-section">
                <div className="platform-header">
                    <h2 className="platform-title">Hỗ trợ mọi nền tảng</h2>
                    <p className="platform-description">
                        Từ web app đến mobile native, chúng tôi cung cấp SDK và API cho tất cả các nền tảng phổ biến.
                    </p>
                </div>

                <div className="platform-grid">
                    <div className="platform-card">
                        <Monitor className="platform-card-icon text-blue-400" />
                        <h3 className="platform-card-title">Web Platform</h3>
                        <p className="platform-card-description">React, Vue, Angular và vanilla JavaScript</p>
                    </div>
                    <div className="platform-card">
                        <Smartphone className="platform-card-icon text-green-400" />
                        <h3 className="platform-card-title">Mobile Apps</h3>
                        <p className="platform-card-description">iOS, Android, React Native, Flutter</p>
                    </div>
                    <div className="platform-card">
                        <Globe className="platform-card-icon text-purple-400" />
                        <h3 className="platform-card-title">API Integration</h3>
                        <p className="platform-card-description">REST API, WebSocket, GraphQL</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2 className="cta-title">Sẵn sàng kết nối mọi nền tảng?</h2>
                    <p className="cta-description">
                        Bắt đầu xây dựng hệ thống chat đa nền tảng của bạn ngay hôm nay. Miễn phí trong 30 ngày đầu.
                    </p>
                    <div className="cta-buttons">
                        <Link to="/chat" className="cta-primary-button">
                            Bắt đầu miễn phí
                        </Link>
                        <button className="cta-secondary-button">Liên hệ tư vấn</button>
                    </div>
                </div>
            </section>
        </main>
    )
}
