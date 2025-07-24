import * as httpRequest from "~/Util/httpsRequest";

const ERROR_MESSAGES_VI = {
    "Username already exists.": {
        key: "username",
        message: "Tên người dùng đã tồn tại",
    },
    "Email already exists.": { key: "email", message: "Email đã tồn tại" },
    // ... thêm các lỗi khác tương ứng
    DEFAULT: {
        key: "default",
        message: "Đã xảy ra lỗi, vui lòng thử lại sau.",
    },
};

class AuthService {
    // login
    async login({ username, password }) {
        try {
            const result = await httpRequest.POST("auth/register", {
                body: {
                    username,
                    password,
                },
            });
            console.log(result);
            return result.data;
        } catch (error) {
            return { error: error.message };
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
}
export default new AuthService();
