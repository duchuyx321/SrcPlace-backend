import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectAuthStatus } from "~/Features/Auth/AuthSelect";
import { adDataAuth } from "~/Features/Auth/AuthSlice";
import { closeAuthModal } from "~/Features/AuthModal/authModalSlice";
import { addToast } from "~/Features/Toast/toastSlice";
import AuthService from "~/Services/AuthService";

function useAuthFlowController() {
    const dispatch = useDispatch();
    const authStatus = useSelector(selectAuthStatus) || {
        isSession: false,
        isEnabled2FA: false,
        isTrustDevices: false,
        isVerify2FA: false,
    };
    const handleResumeSession = async () => {
        try {
            const resultResumeSession = await AuthService.checkResumeSession();
            // xóa mã tạm thời và thêm token
            localStorage.removeItem("TempToken");
            localStorage.setItem(
                "AccessToken",
                resultResumeSession.meta.AccessToken
            );
            setTimeout(() => {
                dispatch(closeAuthModal());
                dispatch(
                    adDataAuth({
                        user: resultResumeSession.data,
                    })
                );
            }, 300);
        } catch (error) {
            dispatch(
                addToast({
                    type: "error",
                    title: error.message,
                    duration: 3000,
                })
            );
        }
    };
    useEffect(() => {
        if (!authStatus.isInitialized) return;
        if (
            authStatus.isSession &&
            !authStatus.isTrustDevices &&
            authStatus.isEnabled2FA
        ) {
            // hiểu thị xác nhận
            return;
        }
        if (authStatus.isSession && authStatus.isTrustDevices) {
            // hiện thị thông báo tài khoản đang được đăng nhập ở một thiết bị khác modal
            return;
        }
        if (!authStatus.isTrustDevices && !authStatus.isSession) {
            //  hiển thị thông báo bạn đang đăng nhập ở 1 thiết bị lạ có muốn đăng nhập hay không
        }
    }, [authStatus]);
}

export default useAuthFlowController;
