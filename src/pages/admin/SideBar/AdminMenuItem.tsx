import { UserCircle } from "lucide-react";

// menuItems.js
export const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "📊", path: "/admin" },
  { id: "conversations", label: "Conversations", icon: "💬", path: "/admin/conversation" },
  { id: "platforms", label: "Platforms", icon: "🌐", path: "/admin/platforms" },
  { id: "staff", label: "Staff", icon: <UserCircle />, path: "/admin/staff" },
  // { id: "settings", label: "Settings", icon: "⚙️", path: "/admin/settings" },
  // { id: "reports", label: "Reports", icon: "📊" ,path: "/admin/reports" },
];
