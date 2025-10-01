import { Routes, Route } from 'react-router-dom'
import MainLayout from './MainLayOut.tsx'
import Home from '../pages/Home/home.tsx'
import ChatBox from '../pages/Chatbox/Chatbox.tsx'
import AuthForm from '../pages/auth-form/Auth-form.tsx'
import ConversationDetail from '../pages/Conversation_Details/ConversationDetail.tsx'
import HomeMain from '../pages/Home/HomeMain.tsx'
import ZaloLoginQR from '../components/Zalo/ZaloLoginQR.tsx'
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
        </Routes >
    )
}   
