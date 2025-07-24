import axios from "axios";
import AuthService from "~/Services/AuthService";

const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_URL_SERVER,
    withCredentials: true,
});
httpRequest.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("AccessToken");
        const TempToken = localStorage.getItem("TempToken");
        const finalToken = token || TempToken;
        if (finalToken) {
            config.headers.Authorization = finalToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(new Error(error.message));
    }
);
httpRequest.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            (error.response?.status === 401 ||
                error.response?.status === 403) &&
            (error.response?.data?.error === "jwt expired" ||
                error.response?.data?.message === "jwt expired") &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                await AuthService.refreshToken();
                const newToken = localStorage.getItem("AccessToken");
                if (newToken) {
                    originalRequest.headers.Authorization = newToken;
                    return httpRequest(originalRequest);
                }
                throw new Error("Không lấy được token mới!");
            } catch (refreshError) {
                // Hiển thị form thông báo phiên đăng nhập hết hạn
                // Logout nếu không refresh được
                await AuthService.logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(new Error(error.message));
    }
);

export const GET = async (path, option = {}) => {
    const response = await httpRequest.get(path, option);
    return response.data;
};

export const POST = async (path, option = {}) => {
    const response = await httpRequest.post(path, option);
    return response.data;
};
export const PATCH = async (path, option = {}) => {
    const response = await httpRequest.patch(path, option);
    return response.data;
};
export const DELETE = async (path, option = {}) => {
    const response = await httpRequest.delete(path, option);
    return response.data;
};
