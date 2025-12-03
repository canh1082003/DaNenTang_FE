import "./PageBase.css";

export default function PricingPage() {
  return (
    <main className="page-container">
      <h1 className="page-title">Bảng giá dịch vụ</h1>
      <p className="page-desc">
        Chọn gói phù hợp với nhu cầu của bạn. Linh hoạt – minh bạch – rõ ràng.
      </p>

      <div className="price-grid">
        <div className="price-card">
          <h3>Miễn phí</h3>
          <h2>0₫</h2>
          <p>Dành cho cá nhân nhỏ lẻ.</p>
          <button className="price-btn">Dùng ngay</button>
        </div>

        <div className="price-card highlight">
          <h3>Pro</h3>
          <h2>149.000₫ / tháng</h2>
          <p>Dành cho nhóm và doanh nghiệp nhỏ.</p>
          <button className="price-btn">Nâng cấp</button>
        </div>

        <div className="price-card">
          <h3>Enterprise</h3>
          <h2>Liên hệ</h2>
          <p>Giải pháp lớn, tuỳ chỉnh đặc biệt.</p>
          <button className="price-btn">Liên hệ tư vấn</button>
        </div>
      </div>
    </main>
  );
}
