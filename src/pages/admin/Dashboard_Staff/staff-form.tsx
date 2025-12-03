"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { EditUserApi } from "../../../hooks/auth/user/useEditUser";
import { createUserApi } from "../../../hooks/auth/user/useCreateUser";
import { DeleteUserApi } from "../../../hooks/auth/user/useDeleteUser";

export default function StaffForm({
  staff,
  mode,
  onClose,
}: {
  staff: any;
  mode: "add" | "edit";
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "support",
    isVerifyEmail: false,
  });

  useEffect(() => {
    if (mode === "edit" && staff) {
      setFormData({
        ...formData,
        username: staff.username,
        email: staff.email,
        department: staff.department,
        isVerifyEmail: staff.isVerifyEmail,
      });
    }

    if (mode === "add") {
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        department: "support",
        isVerifyEmail: false,
      });
    }
  }, [mode, staff]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "add") {
        const payload = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          department: formData.department,
        };

        await createUserApi(payload);
        toast.success("Tạo nhân viên thành công!");
      }

      if (mode === "edit") {
        const payload = {
          username: formData.username,
          email: formData.email,
          department: formData.department,
          isVerifyEmail: formData.isVerifyEmail,
        };

        await EditUserApi(staff._id, payload);
        toast.success("Cập nhật nhân viên thành công!");
      }

      onClose();
       window.location.reload();
    } catch (err: any) {
      const message = err.response?.data?.message || "Có lỗi xảy ra";
      toast.error(message);
    }
  };
//   const handleDelete = async (id: string) => {
//   try {
//     await DeleteUserApi(id);
//     toast.success("Xoá nhân viên thành công!");

//     // Reload staff list (không reload trang)
//     setReload(prev => !prev);

//   } catch (err) {
//     toast.error("Xoá thất bại!");
//   }
// };

  return (
    <div className="staff-modal-overlay">
      <div className="staff-modal">
        <div className="staff-modal-header">
          <h2 className="staff-modal-title">
            {mode === "edit" ? "Edit Staff" : "Add New Staff"}
          </h2>
          <button onClick={onClose} className="staff-modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="staff-modal-form">
          <div className="staff-form-group">
            <label className="staff-label">Name</label>
            <input
              className="staff-input"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Full name"
            />
          </div>

          <div className="staff-form-group">
            <label className="staff-label">Email</label>
            <input
              className="staff-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="email@example.com"
            />
          </div>

          {mode === "add" && (
            <div className="staff-form-group">
              <label className="staff-label">Password</label>
              <input
                className="staff-input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Set password"
              />
            </div>
          )}
          {mode === "add" && (
            <div className="staff-form-group">
              <label className="staff-label">ConFirm Password</label>
              <input
                className="staff-input"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Set confirmPassword"
              />
            </div>
          )}
          <div className="staff-form-group">
            <label className="staff-label">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="staff-select"
            >
              <option value="support">Support</option>
              <option value="sales">Sales</option>
              <option value="care">Care</option>
            </select>
          </div>

          <div className="staff-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="staff-btn-cancel bg-transparent"
            >
              Cancel
            </button>
            <button type="submit" className="staff-btn-submit">
              {staff ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
      
    </div>
  );
}
