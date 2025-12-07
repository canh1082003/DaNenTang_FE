import "./TooManyRequests.css";

export default function TooManyRequests() {
  return (
    <div className="error-container request-bg">
      <div className="error-card">
        <div className="error-icon">⚠️</div>
        <h1 className="error-title request-color">Bạn thao tác quá nhanh!</h1>
        <p className="error-text">
          Bạn đang gửi quá nhiều yêu cầu. Vui lòng đợi một chút rồi thử lại.
        </p>
        <a href="/" className="error-btn request-btn">
          Về trang chủ
        </a>
      </div>
    </div>
  );
}
