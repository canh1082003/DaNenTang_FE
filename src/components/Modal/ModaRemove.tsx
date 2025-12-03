"use client";
import { X } from "lucide-react";
import "./ModalRemove.css";
export default function ConfirmDeleteModal({
  show,
  onClose,
  onConfirm,
  message = "Bạn có chắc muốn xoá nhân viên này?",
}: {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Xác nhận xoá</h2>
        </div>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Hủy</button>
          <button className="btn-delete" onClick={onConfirm}>Xóa</button>
        </div>
      </div>
    </div>
  );
}
