import "./PageBase.css";
import { Zap, Shield, Users, Globe } from "lucide-react";

export default function FeaturesPage() {
  
  return (
    <div className="page-container">
      <h1 className="page-title">Tính năng nổi bật</h1>
      <p className="page-desc">
        Hệ thống được thiết kế để đáp ứng các nhu cầu từ cá nhân đến doanh nghiệp.
      </p>

      <div className="page-grid">
        <div className="page-card">
          <Zap size={32} className="icon-blue" />
          <h3>Real-time Sync</h3>
          <p>Đồng bộ ngay lập tức trên mọi nền tảng.</p>
        </div>

        <div className="page-card">
          <Shield size={32} className="icon-purple" />
          <h3>Bảo mật tuyệt đối</h3>
          <p>Mã hóa đầu cuối, đảm bảo an toàn dữ liệu.</p>
        </div>

        <div className="page-card">
          <Users size={32} className="icon-green" />
          <h3>Linh hoạt & mở rộng</h3>
          <p>Hỗ trợ số lượng người dùng lớn.</p>
        </div>

        <div className="page-card">
          <Globe size={32} className="icon-yellow" />
          <h3>Đa ngôn ngữ</h3>
          <p>Tự động dịch tin nhắn theo thời gian thực.</p>
        </div>
      </div>
    </div>

  );
}
