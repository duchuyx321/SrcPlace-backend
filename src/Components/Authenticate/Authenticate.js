import classNames from "classnames/bind";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Tippy from "@tippyjs/react/headless";
import { FaAngleDown } from "react-icons/fa6";
import { useDispatch } from "react-redux";

import style from "./Authenticate.module.scss";
import Button from "~/Components/Button";
import OTPInput from "./OTPInput";
import AuthService from "~/Services/AuthService";
import { addToast } from "~/Features/Toast/toastSlice";
import { stopVerifying } from "~/Features/Verify/VerifySlice";
import { adDataAuth } from "~/Features/Auth/AuthSlice";
import { closeAuthModal } from "~/Features/AuthModal/authModalSlice";

const cx = classNames.bind(style);

const menuAuth = ["Gmail", "2FA"];

function Authenticate({
    title,
    description,
    email,
    isShowListMethod = true,
    isCloseModal = false,
}) {
    const [isClose, setIsClose] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState("Gmail");
    const [resendCode, setResendCode] = useState("Gửi mã");
    const [isResendCode, setIsResendCode] = useState(false);
    const [isDisable, setIsDisable] = useState(false);
    const [otp, setOtp] = useState("");
    const isValid = otp.length === 6;
    const dispatch = useDispatch();
    useEffect(() => {
        if (!isResendCode) return;
        setIsResendCode(true);
        let timeLeft = 60;
        const countDown = setInterval(() => {
            timeLeft -= 1;
            if (timeLeft > 0) {
                setResendCode(`${timeLeft}s`);
            } else {
                clearInterval(countDown);
                setResendCode("Gửi lại");
                setIsResendCode(false);
            }
        }, 1000);
        return () => clearInterval(countDown);
    }, [isResendCode]);
    const handleSelect = (method) => {
        setSelectedMethod(method);
        setVisible(false);
    };
    const resultRender = (attrs) => {
        if (!isShowListMethod) {
            return;
        }
        const restMenu = menuAuth.filter((val) => val !== selectedMethod);
        return (
            <div className={cx("dropdown")} tabIndex="-1" {...attrs}>
                {restMenu.map((item, index) => (
                    <button
                        key={index}
                        className={cx("btn_method")}
                        onClick={() => handleSelect(item)}
                    >
                        {item}
                    </button>
                ))}
            </div>
        );
    };
    const handleOnResendCode = async () => {
        setIsResendCode(true);
        // call api nhận
        await AuthService.sendMail();
    };
    const handleOnSubmit = async () => {
        let type = "";
        switch (selectedMethod) {
            case "Gmail":
                type = "email";
                break;
            case "2fa":
                type = "app";
                break;
            default:
                return;
        }
        setIsDisable(true);
        // call api check
        const result = await AuthService.prevCheck({
            code: otp,
            action: "register",
            type,
        });
        if (result.error) {
            dispatch(
                addToast({
                    type: "error",
                    title: "Mã otp không hợp lệ!",
                    duration: 3000,
                })
            );
        }
        dispatch(
            addToast({
                type: "success",
                title: "Mã otp hợp lệ!",
                duration: 3000,
            })
        );
        // xóa mã tạm thời và thêm token
        localStorage.removeItem("TempToken");
        localStorage.setItem("AccessToken", result.meta.AccessToken);
        setIsDisable(false);
        // đẩy close và bật avatar
        setIsClose(true);
        setTimeout(() => {
            dispatch(stopVerifying()); // đóng modal sau 300ms
            dispatch(closeAuthModal());
            dispatch(
                adDataAuth({
                    user: result.data,
                })
            );
        }, 300);
    };
    return (
        <div className={cx("wrapper", { fadeOut: isClose })}>
            <div className={cx("container")}>
                <div className={cx("title")}>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <p>{`email : ${email}`}</p>
                </div>
                <div className={cx("selectMethod")}>
                    <p>Chọn phương thức xác thực</p>
                    <div className={cx("method")}>
                        <Tippy
                            interactive
                            visible={visible && isShowListMethod}
                            placement="bottom-start"
                            onClickOutside={() => setVisible(false)}
                            render={resultRender}
                            offset={[0, 2]}
                        >
                            <button
                                className={cx("btn_method", "btn_active")}
                                onClick={() => setVisible(!visible)}
                            >
                                {selectedMethod}
                                {isShowListMethod && (
                                    <span>
                                        <FaAngleDown />
                                    </span>
                                )}
                            </button>
                        </Tippy>
                    </div>
                </div>
                <div className={cx("otpInput")}>
                    <p>Nhập Mã OTP:</p>
                    <OTPInput length={6} handleOnSetOTP={setOtp} />
                </div>
                <div className={cx("action")}>
                    <div className={cx("action_out")}>
                        {isCloseModal && (
                            <Button primary className={cx("btn_close")}>
                                Trở về
                            </Button>
                        )}
                        <Button
                            disable={!isValid && !isDisable}
                            primary
                            className={cx("btn_submit")}
                            onClick={() => handleOnSubmit()}
                        >
                            Xác Nhận
                        </Button>
                    </div>
                    <Button
                        outline
                        disable={isResendCode}
                        large
                        onClick={() => handleOnResendCode()}
                        className={cx("btn_resendCode")}
                    >
                        {resendCode}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Authenticate;
