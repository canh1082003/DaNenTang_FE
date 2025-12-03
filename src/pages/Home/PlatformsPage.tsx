import "./PageBase.css";
import { Monitor, Smartphone, Tablet, Code } from "lucide-react";

export default function PlatformsPage() {
  return (
    <main className="page-container">
      <h1 className="page-title">Nền tảng hỗ trợ</h1>
      <p className="page-desc">
        MultiChat hoạt động mạnh mẽ trên mọi thiết bị và công nghệ.
      </p>

      <div className="page-grid">
        <div className="page-card">
          <Monitor size={40} className="icon-blue" />
          <h3>Web App</h3>
          <p>Hoạt động mượt mà trên mọi trình duyệt.</p>
        </div>

        <div className="page-card">
          <Smartphone size={40} className="icon-green" />
          <h3>Mobile App</h3>
          <p>iOS, Android, React Native & hơn thế nữa.</p>
        </div>

        <div className="page-card">
          <Tablet size={40} className="icon-purple" />
          <h3>Tablet</h3>
          <p>Thiết kế tối ưu cho màn hình lớn.</p>
        </div>

        <div className="page-card">
          <Code size={40} className="icon-yellow" />
          <h3>API / SDK</h3>
          <p>Dễ dàng tích hợp vào bất kỳ hệ thống nào.</p>
        </div>
      </div>
    </main>
  );
}
