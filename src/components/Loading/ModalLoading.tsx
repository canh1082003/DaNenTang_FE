import React from "react";
import "./ModalLoading.css"

interface LoadingModalProps {
  show: boolean;     // hiển thị hay không
  text?: string;     // nội dung hiển thị (ví dụ: "Đang kết nối...")
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ show, text }) => {
  if (!show) return null;

  return (
    <div className="loading-modal-overlay">
      <div className="loading-modal-content">
        <div className="loading-spinner" />
        {text && <p className="loading-text">{text}</p>}
      </div>
    </div>
  );
};
