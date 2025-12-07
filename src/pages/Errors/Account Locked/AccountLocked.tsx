import "./AccountLocked.css";

export default function AccountLocked() {
  return (
    <div className="error-container locked-bg">
      <div className="error-card">
        <div className="error-icon">🔒</div>
        <h1 className="error-title locked-color">Tài khoản tạm bị khóa</h1>
        <p className="error-text">
          Bạn đã đăng nhập sai quá nhiều lần.  
          Vui lòng thử lại sau vài phút.
        </p>
        <a href="/login" className="error-btn locked-btn">
          Quay lại đăng nhập
        </a>
      </div>
    </div>
  );
}
