"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import "./staff.css";
import StaffTable from "./staff-table";
import StaffForm from "./staff-form";
import { useGetAllUser } from "../../../hooks/auth/user/useGetAll";

export default function StaffPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const { staff, loading } = useGetAllUser();


  const handleAddStaff = () => {
    setEditingStaff(null);
    setFormMode("add");
    setIsFormOpen(true);
  };

  const handleEditStaff = (staffMember: any) => {
    setEditingStaff(staffMember);
    setFormMode("edit");
    setIsFormOpen(true);
  };


  return (
    <div className="staff-container">
      <div className="staff-header">
        <div>
          <h1 className="staff-title">Staff Management</h1>
          <p className="staff-subtitle">
          </p>
        </div>
        <button onClick={handleAddStaff} className="staff-add-btn">
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </button>
      </div>

      <button className="staff-card">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <StaffTable
            staff={staff || []}
            onEdit={handleEditStaff}
            onDelete={() => {}}
          />
        )}
      </button>

      {isFormOpen && (
        <StaffForm
          mode={formMode}
          staff={editingStaff}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
