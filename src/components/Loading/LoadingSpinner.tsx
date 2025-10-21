import React from "react";
import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  size?: number;   // kích thước (px)
  color?: string;  // màu spinner
  text?: string;   // dòng chữ hiển thị bên cạnh
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  color = "#007bff",
  text,
}) => {
  return (
    <div className="loading-spinner-wrapper">
      <div
        className="loading-spinner"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderTopColor: color,
        }}
      />
      {text && <span className="loading-spinner-text">{text}</span>}
    </div>
  );
};
