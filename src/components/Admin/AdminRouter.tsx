// src/components/Admin/AdminRoute.tsx
import React from "react";
import   {Navigate, replace } from "react-router-dom";
    
interface Props {
  children: React.ReactNode;
}

const AdminRoute: React.FC<Props> = ({ children }) => {
  const userInfo = localStorage.getItem("userInfo");
  const user = userInfo ? JSON.parse(userInfo) : null;
  const role = user?.role;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
