import React, { useState, useEffect } from 'react';
import './VerifyEmail.css';
import { useParams } from 'react-router-dom';

interface VerifyEmailProps {
  email?: string;
}

const VerifyEmail: React.FC<VerifyEmailProps> = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const {email} = useParams()

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');


  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text);
    setStatus(type);
  };

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      showMessage('Vui lòng nhập mã xác thực 6 số', 'error');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('http://localhost:4000/api/v1/user/verifyEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verificationCode: verificationCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(data.message || 'Xác thực email thành công!', 'success');
        setTimeout(() => {
          // Redirect sau khi thành công
          window.location.href = '/login';
        }, 2000);
      } else {
        showMessage(data.message || 'Xác thực thất bại. Vui lòng thử lại.', 'error');
      }
    } catch (error) {
      showMessage('Có lỗi xảy ra. Vui lòng kiểm tra kết nối và thử lại.', 'error');
    }
  };

  const handleResend = async () => {
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('http://localhost:4000/api/v1/user/resendVerification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('Mã xác thực đã được gửi lại!', 'success');
      } else {
        showMessage(data.message || 'Không thể gửi lại mã. Vui lòng thử lại sau.', 'error');
      }
    } catch (error) {
      showMessage('Có lỗi xảy ra khi gửi lại mã.', 'error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setVerificationCode(value);
    
    if (value.length === 6 && status !== 'loading') {
      handleVerify();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && status !== 'loading') {
      handleVerify();
    }
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        {/* Header */}
        <div className="header">
          <div className="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
              <polyline points="3 7 12 13 21 7"></polyline>
            </svg>
          </div>
          <h1>Mã xác nhận đã gửi về email của bạn</h1>
          <p>Vui lòng kiểm tra hộp thư và nhập mã xác thực để hoàn tất</p>
        </div>

        {/* Email Display */}
        <div className="email-display">
          {email}
        </div>

        {/* Verification Code Input */}
        <div className="form-group">
          <label htmlFor="code">Mã xác thực</label>
          <input 
            type="text" 
            id="code" 
            value={verificationCode}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="000000" 
            maxLength={6}
            autoComplete="off"
            disabled={status === 'loading'}
          />
        </div>

        {/* Status Message */}
        {message && (
          <div className={`message ${status}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {status === 'success' ? (
                <>
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9 12l2 2 4-4"></path>
                </>
              ) : (
                <>
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v4M12 16h.01"></path>
                </>
              )}
            </svg>
            <span>{message}</span>
          </div>
        )}

        {/* Submit Button */}
        <button 
          className="btn btn-primary" 
          onClick={handleVerify}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <div className="spinner"></div>
              <span>Đang xác thực...</span>
            </>
          ) : (
            <span>Xác thực Email</span>
          )}
        </button>

        {/* Footer */}
        <div className="footer">
          <p>
            Không nhận được mã?{' '}
            <button 
              onClick={handleResend}
              disabled={status === 'loading'}
            >
              Gửi lại
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;