import "./ServerOverload.css";

export default function ServerOverload() {
  return (
    <div className="error-container overload-bg">
      <div className="error-card">
        <div className="error-icon">🛑</div>
        <h1 className="error-title overload-color">Hệ thống quá tải</h1>
        <p className="error-text">
          Máy chủ đang xử lý quá nhiều yêu cầu.  
          Vui lòng thử lại sau vài phút.
        </p>
        <a href="/" className="error-btn overload-btn">
          Thử lại
        </a>
      </div>
    </div>
  );
}
