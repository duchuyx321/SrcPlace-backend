import axios from "axios";

const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_URL_SERVER,
    withCredentials: true,
});

httpRequest.interceptors.request.use(
    (config) => {
        // thêm token trước khi gửi lên
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
