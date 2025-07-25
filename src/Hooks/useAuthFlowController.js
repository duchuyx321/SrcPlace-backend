import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AuthService from "~/Services/AuthService";
import { addToast } from "~/Features/Toast/toastSlice";
import {
    adDataAuth,
    clearDataAuth,
    clearAuthStatue,
} from "~/Features/Auth/AuthSlice";
import { startVerifying } from "~/Features/Verify/VerifySlice";
import { closeAuthModal } from "~/Features/AuthModal/authModalSlice";
import { selectAuthStatus } from "~/Features/Auth/AuthSelect";
import { openModal, clickBtnModal } from "~/Features/Modal/modalSlice";
import {
    selectIsClickBtnCancelModal,
    selectIsClickBtnConfirmModal,
} from "~/Features/Modal/modalSelect";

function useAuthFlowController() {
    const dispatch = useDispatch();
    const isClickBtnConfirm = useSelector(selectIsClickBtnConfirmModal);
    const isClickBtnCancel = useSelector(selectIsClickBtnCancelModal);

    const authStatus = useSelector(selectAuthStatus);
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
                dispatch(clearAuthStatue());
                dispatch(
                    adDataAuth({
                        user: resultResumeSession.data,
                    })
                );
                dispatch(
                    clickBtnModal({
                        key: "isCloseModal",
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
    const handleCancel = async () => {
        dispatch(clearDataAuth());
        dispatch(closeAuthModal());
        localStorage.removeItem("TempToken");
        dispatch(
            clickBtnModal({
                key: "isCloseModal",
            })
        );
    };
    useEffect(() => {
        if (!isClickBtnConfirm) return;
        handleResumeSession();
    }, [isClickBtnConfirm]);
    useEffect(() => {
        if (!isClickBtnCancel) return;
        handleCancel();
    }, [isClickBtnCancel]);
    useEffect(() => {
        if (!authStatus.isInitialized) return;
        if (
            authStatus.isSession &&
            !authStatus.isTrustDevices &&
            authStatus.isEnabled2FA
        ) {
            // hiểu thị xác nhận
            dispatch(
                startVerifying({
                    isClose: false,
                    isShowListMethod: authStatus.isVerify2FA,
                    title: "Xác thực hai bước",
                    description:
                        "Bạn đang đăng nhập từ một thiết bị mới. Để đảm bảo an toàn, vui lòng xác thực để tiếp tục." +
                        " Bạn có thể đánh dấu thiết bị này là tin cậy sau khi hoàn tất.",
                })
            );
            return;
        }
        if (authStatus.isSession && authStatus.isTrustDevices) {
            // hiện thị thông báo tài khoản đang được đăng nhập ở một thiết bị khác modal
            dispatch(
                openModal({
                    isEventCloseModal: true,
                    type: "warning",
                    title: "Phát hiện đăng nhập khác!",
                    description:
                        "Tài khoản của bạn đang được duy trì đăng nhập trên một thiết bị khác. Nếu đó không phải là bạn, hãy đổi mật khẩu ngay." +
                        " Chúng tôi sẽ đăng xuất các thiết bị khác để đảm bảo chỉ một thiết bị được duy trì đăng nhập.",
                })
            );
            return;
        }
        if (!authStatus.isTrustDevices && !authStatus.isSession) {
            //  hiển thị thông báo bạn đang đăng nhập ở 1 thiết bị lạ có muốn đăng nhập hay không
            dispatch(
                openModal({
                    isEventCloseModal: true,
                    type: "warning",
                    title: "Phát hiện đăng nhập trên thiết bị lạ!",
                    description:
                        "Tài khoản của bạn đang đăng nhập trên một thiết bị lạ. Nếu không phải là bạn, vui lòng kiểm tra lại mật khẩu và đăng xuất khỏi các thiết bị khác.",
                })
            );
            return;
        }
        handleResumeSession();
    }, [authStatus]);
}

export default useAuthFlowController;
