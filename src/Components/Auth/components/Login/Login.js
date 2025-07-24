import classNames from "classnames/bind";
import { useState } from "react";
import { RiLoader2Line } from "react-icons/ri";
import { useDispatch } from "react-redux";

import style from "./Login.module.scss";
import BoxInput from "../BoxInput";
import Button from "~/Components/Button";
import AuthService from "~/Services/AuthService";
import { addToast } from "~/Features/Toast/toastSlice";
import { adDataAuth, updateAuthStatus } from "~/Features/Auth/AuthSlice";

const cx = classNames.bind(style);

function Login({ className = "" }) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorKey, setErrorKey] = useState("");
    const [form, setForm] = useState({
        usernameOrEmail: "",
        password: "",
    });
    const dispatch = useDispatch();
    // handle add variables
    const handleOnAddVariables = ({ key = "", value = "" } = {}) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };
    //  check variables
    const isValid = Object.values(form).every((item) => item.trim() !== "");
    const handleOnSubmit = async () => {
        setIsLoading(true);
        try {
            // call api
            const resultLogin = await AuthService.login({
                usernameOrEmail: form.usernameOrEmail,
                password: form.password,
            });
            const TempToken = resultLogin.meta?.TempToken;
            if (TempToken) {
                const meta = resultLogin.meta;
                localStorage.setItem("TempToken", TempToken);
                // thêm authStatus
                dispatch(
                    updateAuthStatus({
                        isSession: meta?.is_session,
                        isEnabled2FA: meta?.is_enabled2fa,
                        isTrustDevices: meta?.is_trustDevices,
                        isVerify2FA: meta?.is_verify2fa,
                    })
                );
                return;
            }
            // thêm thông tin người dùng khi đúng
            dispatch(
                adDataAuth({
                    user: resultLogin.data,
                })
            );
        } catch (err) {
            dispatch(
                addToast({
                    type: "error",
                    title: err.error.message,
                    duration: 3000,
                })
            );
            setErrorKey(err.error.key);
            handleOnAddVariables({ key: err.error?.key, value: "" });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className={cx("wrapper", { [className]: className })}>
            <div className={cx("container")}>
                <BoxInput
                    id="usernameOrEmail"
                    title="Username or Email"
                    isRequired
                    handleSetValue={handleOnAddVariables}
                    isError={errorKey === "usernameOrEmail"}
                />
                <BoxInput
                    id="password"
                    title="Mật khẩu"
                    isPassword
                    isRequired
                    handleSetValue={handleOnAddVariables}
                    isError={errorKey === "password"}
                />
                <button className={cx("btn_forget")}>Quên mật khẩu?</button>
            </div>
            <div className={cx("action")}>
                <Button
                    primary
                    large
                    disable={!isValid || isLoading}
                    className={cx("btn_submit")}
                    onClick={() => handleOnSubmit()}
                >
                    Đăng Nhập
                </Button>
                {isLoading && (
                    <span className={cx("loader")}>
                        <RiLoader2Line />
                    </span>
                )}
            </div>
        </div>
    );
}

export default Login;
