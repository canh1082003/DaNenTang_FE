import { Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayOut.tsx";
import Home from "../pages/Home/home.tsx";
import ChatBox from "../pages/Chatbox/Chatbox.tsx";
import AuthForm from "../pages/auth-form/Auth-form.tsx";
import HomeMain from "../pages/Home/HomeMain.tsx";
import ZaloLoginQR from "../components/Zalo/ZaloLoginQR.tsx";
import AdminLayout from "./AdminLayout.tsx";
import Dashboard from "../pages/admin/Dashboard/Dashboard.tsx";
import Sidebar from "../pages/admin/SideBar/SideBar.tsx";
import Conversations from "../pages/admin/Conversations/conversations.tsx";
import Analytics from "../pages/admin/Analytics/Analytics.tsx";
import Settings from "../pages/admin/Settings/Settings.tsx";
import Platforms from "../pages/admin/Platforms/platforms.tsx";
import Reports from "../pages/admin/Reports/Reports.tsx";
import AdminRoute from "../components/Admin/AdminRouter.tsx";
import Forbidden403 from "../pages/403/403.tsx";
import ConversationDetail from "../pages/Conversation_Details/ConversationDetail.tsx";
import VerifyEmail from "../pages/auth-form/ verifyEmail.tsx";
import UserProfile from "../pages/InfoStaff/infoStaff.tsx";
import StaffPage from "../pages/admin/Dashboard_Staff/DashBoard_Staff.tsx";
import FeaturesPage from "../pages/Home/FeaturesPage.tsx";
import PlatformsPage from "../pages/Home/PlatformsPage.tsx";
import PricingPage from "../pages/Home/PricingPage.tsx";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
      <Route path="/ChatBox" element={<ChatBox />} />
            <Route index element={<HomeMain />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/platforms" element={<PlatformsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<AuthForm />} />
            <Route path="/verify-email/:email" element={<VerifyEmail />} />
            <Route path="/zalo-login" element={<ZaloLoginQR />} />
            <Route
                path="/chat/:conversationId"
                element={<ConversationDetail chatType="customer" />}
              />
            <Route path="/infoStaff" element={<UserProfile />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="conversation" element={<Conversations />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="platforms" element={<Platforms />} />
        <Route path="reports" element={<Reports />} />
        <Route path="staff" element={<StaffPage />} />
      </Route>
      </Route>
      <Route path="/403" element={<Forbidden403 />} />
    </Routes>
  );
};
