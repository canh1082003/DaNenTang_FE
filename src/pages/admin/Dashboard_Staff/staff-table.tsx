"use client";

import { CircleXIcon, SquarePen } from "lucide-react";
import { StaffMember } from "./type";
import { useState } from "react";
import ConfirmDeleteModal from "../../../components/Modal/ModaRemove";
import { DeleteUserApi } from "../../../hooks/auth/user/useDeleteUser";
import { toast } from "react-toastify";

export default function StaffTable({
  staff,
  onEdit,
  onDelete,
}: {
  staff: StaffMember[];
  onEdit: (staff: StaffMember) => void;
  onDelete: (id: number) => void;
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await DeleteUserApi(deleteId); // API delete
      toast.success("Xoá nhân viên thành công!");
      setShowDeleteModal(false);
      setDeleteId(null);
      window.location.reload();
    } catch (error) {
      toast.error("Xoá thất bại!");
    }
  };

  return (
    <div className="staff-table-wrapper">
      <table className="staff-table">
        <thead className="staff-table-head">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>isVerifyEmail</th>
            <th>role</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff
            ?.filter((member) => member.role === "staff")
            .map((member, index) => (
              <tr key={index} className="staff-table-row">
                <td className="staff-cell-name">{member.username}</td>
                <td className="staff-cell">{member.email}</td>
                <td>{Boolean(member.isVerifyEmail).toString()}</td>
                <td className="staff-cell">{member.role}</td>
                <td className="staff-cell">{member.department}</td>

                <td className="staff-cell-actions">
                  <button
                    onClick={() => onEdit(member)}
                    className="staff-btn-edit"
                  >
                    <SquarePen className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setDeleteId(member._id);
                      setShowDeleteModal(true);
                    }}
                    className="staff-btn-delete"
                  >
                    <CircleXIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        message="Bạn chắc chắn muốn xoá nhân viên này?"
      />
    </div>
  );
}
