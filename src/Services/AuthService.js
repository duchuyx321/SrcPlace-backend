import store from "~/App/store";

import * as httpRequest from "~/Util/httpsRequest";
import { clearDataAuth } from "~/Features/Auth/AuthSlice";
import { clearCart } from "~/Features/Cart/cartSlice";
const ERROR_MESSAGES_VI = {
    "Username already exists.": {
        key: "username",
        message: "Tên người dùng đã tồn tại",
    },
    "Email already exists.": { key: "email", message: "Email đã tồn tại" },
    "wrong username or email!": {
        key: "usernameOrEmail",
        message: "username or email không chính sác!",
    },
    "user is blocked": {
        key: "usernameOrEmail",
        message: "username or email không chính sác!",
    },
    DEFAULT: {
        key: "default",
        message: "Đã xảy ra lỗi, vui lòng thử lại sau.",
    },
};

class AuthService {
    // login
    async login({ usernameOrEmail, password }) {
        try {
            const result = await httpRequest.POST("auth/login", {
                usernameOrEmail,
                password,
            });
            console.log(result);
            return result.data;
        } catch (error) {
            console.log(error);
            const errMsg = error?.response?.data?.error || "";
            const message =
                ERROR_MESSAGES_VI[errMsg] || ERROR_MESSAGES_VI.DEFAULT;
            return { error: message };
        }
    }
    // register
    async register({ form = {} }) {
        try {
            const result = await httpRequest.POST("auth/register", form);
            return result.data;
        } catch (error) {
            console.log(error);
            const errMsg = error?.response?.data?.error || "";
            const message =
                ERROR_MESSAGES_VI[errMsg] || ERROR_MESSAGES_VI.DEFAULT;
            return { error: message };
        }
    }
    // send mail
    async sendMail() {
        try {
            const result = await httpRequest.POST("auth/send-mail");
            return result.data;
        } catch (error) {
            return { error: error.message };
        }
    }
    // prev check
    async prevCheck({ action = "login", code = "", type = "email" } = {}) {
        try {
            const result = await httpRequest.POST("auth/pre-login-check", {
                action,
                code,
                type,
            });
            return result;
        } catch (error) {
            return { error: error.message };
        }
    }
    // refresh token
    async refreshToken() {
        try {
            const result = await httpRequest.POST("auth/refresh");
            // thêm vào local
            const newAccessToken = result.data?.meta?.AccessToken;
            if (!newAccessToken) {
                throw new Error("Không lấy được token mới!");
            }
            localStorage.setItem("AccessToken", newAccessToken);
            return newAccessToken;
        } catch (error) {
            throw new Error(error);
        }
    }
    async logout() {
        try {
            await httpRequest.POST("auth/logout");
            localStorage.removeItem("AccessToken");
            store.dispatch(clearDataAuth());
            store.dispatch(clearCart());
        } catch (error) {
            console.error("Logout API error:", error);
        }
    }
}
export default new AuthService();
