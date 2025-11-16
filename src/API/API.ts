import axios, { type AxiosInstance } from "axios";
import { baseURL } from "./constant";
import {
  LOGIN_URL,
  LOGOUT_URL,
  REGISTER_URL,
} from "../hooks/auth/user/constant";
import { ApiSuccessResponse } from "../hooks/type.ts";
import { LoginData, RegisterData } from "../hooks/auth/user/type.ts";
import { toast } from "react-toastify";
export class Api {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL,
      timeout: 6000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        switch (url) {
          case REGISTER_URL: {
            const registerResponse =
              response as ApiSuccessResponse<RegisterData>;
            const email = registerResponse.data.data.email;
            if (email) {
              toast.success("Register Success");
              setTimeout(() => {
                window.location.href = "/login";
              }, 200);
            }

            return response;
          }

          case LOGIN_URL: {
            const LoginResponse = response as ApiSuccessResponse<LoginData>;
            const userInfo = LoginResponse.data.data;
            localStorage.setItem("userInfo", JSON.stringify(userInfo));

            if (userInfo.role === "admin") window.location.href = "/admin";
            else if (userInfo.role === "staff") {
              toast.success("Đăng Nhập Thành Công");
              setTimeout(() => {
                window.location.href = "/Chatbox";
              }, 2000);
            
            } else {
              toast.success("Đăng Nhập Thành Công");
              setTimeout(() => {
                window.location.href = "/Chatbox";
              }, 2000);
            }
            return response;
          }
          case LOGOUT_URL: {
            localStorage.removeItem("userInfo");
            window.location.href = "/";
            return response;
          }

          default: {
            return response;
          }
        }
      },
      (error: any) => {
        const errorData = error.response?.data;
        const errorStatus = error.response?.status;
        console.log(errorData);
        if (errorStatus === 403) {
                window.location.href = "/403";
            
        }
        if (errorStatus === 401) {
          window.location.href = "/login";
        }
        const errorMessage = errorData?.message || "Đã xảy ra lỗi";
        toast.error(errorMessage);
      }
    );
  }
}
const api = new Api().instance;
export default api;
