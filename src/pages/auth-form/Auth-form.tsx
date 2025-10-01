import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import "./style.css"
import { FormData } from "./type"
import api from "../../API/API"
import { LOGIN_URL, REGISTER_URL } from "../../hooks/auth/user/constant"



export default function AuthForm() {
    const [activeTab, setActiveTab] = useState<"login" | "register">("login")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loginData, setLoginData] = useState<FormData>({ email: "", password: "" })
    const [registerData, setRegisterData] = useState<FormData>({
        email: "",
        password: "",
        confirmPassword: "",
        username: "",
    })
    const [isLoading, setIsLoading] = useState(false)



    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await api.post(LOGIN_URL, {
            email: loginData.email,
            password: loginData.password
        })

        setIsLoading(true)
    }

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await api.post(REGISTER_URL, {
            username: registerData.username,
            email: registerData.email,
            password: registerData.password
        })
        setIsLoading(true)
    }

    return (
        <div className="container">
            <div className="card">
                <div className="cardHeader">
                    <h1 className="cardTitle">Chào mừng bạn</h1>
                    <p className="cardDescription">Đăng nhập hoặc tạo tài khoản mới</p>
                </div>

                <div className="cardContent">
                    <div className="tabs">
                        <div className="tabsList">
                            <button
                                className={`tabsTrigger ${activeTab === "login" ? activeTab : ""}`}
                                onClick={() => setActiveTab("login")}
                            >
                                Đăng nhập
                            </button>
                            <button
                                className={`tabsTrigger ${activeTab === "register" ? activeTab : ""}`}
                                onClick={() => setActiveTab("register")}
                            >
                                Đăng ký
                            </button>
                        </div>

                        {activeTab === "login" && (
                            <div className="tabsContent">
                                <form onSubmit={handleLoginSubmit} className="form">
                                    <div className="formGroup">
                                        <label htmlFor="login-email" className="label">
                                            Email
                                        </label>
                                        <div className="inputWrapper">
                                            <Mail className="inputIcon" />
                                            <input
                                                id="login-email"
                                                type="email"
                                                placeholder="example@email.com"
                                                className="input inputWithIcon" value={loginData.email}
                                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="formGroup">
                                        <label htmlFor="login-password" className="label">
                                            Mật khẩu
                                        </label>
                                        <div className="inputWrapper">
                                            <Lock className="inputIcon" />
                                            <input
                                                id="login-password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="input inputWithIcon inputWithToggle"
                                                value={loginData.password}
                                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                className="toggleButton"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff /> : <Eye />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="rememberRow">
                                        <div className="checkboxGroup">
                                            <input id="remember" type="checkbox" className="checkbox" />
                                            <label htmlFor="remember" className="checkboxLabel">
                                                Ghi nhớ đăng nhập
                                            </label>
                                        </div>
                                        <button type="button" className="forgotLink">
                                            Quên mật khẩu?
                                        </button>
                                    </div>

                                    <button type="submit" className="button" disabled={isLoading} >
                                        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === "register" && (
                            <div className="tabsContent">
                                <form onSubmit={handleRegisterSubmit} className="form">
                                    <div className="formGroup">
                                        <label htmlFor="register-name" className="label">
                                            Họ và tên
                                        </label>
                                        <div className="inputWrapper">
                                            <User className="inputIcon" />
                                            <input
                                                id="register-name"
                                                type="text"
                                                placeholder="Nguyễn Văn A"
                                                className="input inputWithIcon"
                                                value={registerData.username}
                                                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="formGroup">
                                        <label htmlFor="register-email" className="label">
                                            Email
                                        </label>
                                        <div className="inputWrapper">
                                            <Mail className="inputIcon" />
                                            <input
                                                id="register-email"
                                                type="email"
                                                placeholder="example@email.com"
                                                className="input inputWithIcon inputWithToggle"
                                                value={registerData.email}
                                                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="formGroup">
                                        <label htmlFor="register-password" className="label">
                                            Mật khẩu
                                        </label>
                                        <div className="inputWrapper">
                                            <Lock className="inputIcon" />
                                            <input
                                                id="register-password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="input inputWithIcon inputWithToggle"
                                                value={registerData.password}
                                                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                className="toggleButton"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff /> : <Eye />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="formGroup">
                                        <label htmlFor="register-confirm-password" className="label">
                                            Xác nhận mật khẩu
                                        </label>
                                        <div className="inputWrapper">
                                            <Lock className="inputIcon" />
                                            <input
                                                id="register-confirm-password"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="input inputWithIcon inputWithToggle"
                                                value={registerData.confirmPassword}
                                                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                className="toggleButton"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff /> : <Eye />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="termsGroup">
                                        <input id="terms" type="checkbox" className="checkbox" required />
                                        <label htmlFor="terms" className="termsLabel">
                                            Tôi đồng ý với{" "}
                                            <button type="button" className="termsLink">
                                                điều khoản sử dụng
                                            </button>
                                        </label>
                                    </div>

                                    <button type="submit" className="button" disabled={isLoading}>
                                        {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div >

                    <div className="divider">
                        <div className="dividerLine">
                            <div className="dividerBorder" />
                        </div>
                        <div className="dividerText">
                            <span className="dividerTextSpan">Hoặc tiếp tục với</span>
                        </div>
                    </div>


                </div >
            </div >
        </div >
    )
}
