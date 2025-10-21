import { Routes, Route } from 'react-router-dom'
import MainLayout from './MainLayOut.tsx'
import Home from '../pages/Home/home.tsx'
import ChatBox from '../pages/Chatbox/Chatbox.tsx'
import AuthForm from '../pages/auth-form/Auth-form.tsx'
import ConversationDetail from '../pages/Conversation_Details/ConversationDetail.tsx'
import HomeMain from '../pages/Home/HomeMain.tsx'
import ZaloLoginQR from '../components/Zalo/ZaloLoginQR.tsx'
import AdminLayout from './AdminLayout.tsx'
import Dashboard from '../pages/admin/Dashboard/Dashboard.tsx'
import Sidebar from '../pages/admin/SideBar/SideBar.tsx'
import Conversations from '../pages/admin/Conversations/conversations.tsx'
import Analytics from '../pages/admin/Analytics/Analytics.tsx'
import Settings from '../pages/admin/Settings/Settings.tsx'
import Platforms from '../pages/admin/Platforms/platforms.tsx'
import Reports from '../pages/admin/Reports/Reports.tsx'
export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomeMain />} />
                <Route path="/login" element={<AuthForm />} />
                <Route path="/ChatBox" element={<ChatBox />} />
                <Route path="/zalo-login" element={<ZaloLoginQR />} />
                <Route path="/chat/:conversationId" element={<ConversationDetail />} />
            </Route>
            <Route path='/admin' element={<AdminLayout/>}>
                <Route index element={<Dashboard />} />
                <Route path='conversation'  element={<Conversations />} />
                <Route path='analytics'  element={<Analytics />} />
                <Route path='settings'  element={<Settings />} />
                <Route path='platforms'  element={<Platforms />} />
                <Route path='reports'  element={<Reports />} />
            </Route>
        </Routes >
    )
}   
