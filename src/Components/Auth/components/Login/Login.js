import classNames from "classnames/bind";
import { useState } from "react";
import { RiLoader2Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import style from "./Login.module.scss";
import BoxInput from "../BoxInput";
import Button from "~/Components/Button";
import AuthService from "~/Services/AuthService";
import { addToast } from "~/Features/Toast/toastSlice";
import { adDataAuth, updateAuthStatus } from "~/Features/Auth/AuthSlice";

const cx = classNames.bind(style);
const defaultFnc = () => {};

function Login({ className = "", handleOnclose = defaultFnc }) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorKey, setErrorKey] = useState("");
    const [form, setForm] = useState({
        usernameOrEmail: "",
        password: "",
    });
    const dispatch = useDispatch();
    // handle add variables
    const handleOnAddVariables = ({ key = "", value = "" } = {}) => {
        if (!(key in form)) return;
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errorKey === key) setErrorKey("");
    };
    //  check variables
    const isValid = Object.values(form).every((item) => item.trim() !== "");
    const handleOnSubmit = async () => {
        setIsLoading(true);
        // call api
        const resultLogin = await AuthService.login({
            usernameOrEmail: form.usernameOrEmail,
            password: form.password,
        });
        if (resultLogin.error) {
            dispatch(
                addToast({
                    type: "error",
                    title: resultLogin.error?.message || "",
                    duration: 3000,
                })
            );
            setErrorKey(resultLogin.error?.key || "");
            handleOnAddVariables({ key: resultLogin.error?.key, value: "" });
            setIsLoading(false);
            return;
        }
        const TempToken = resultLogin.meta?.TempToken;
        console.log(TempToken);
        if (TempToken) {
            const meta = resultLogin.meta;
            localStorage.setItem("TempToken", TempToken);
            // thêm authStatus
            dispatch(
                updateAuthStatus({
                    isInitialized: true,
                    isSession: meta?.is_session,
                    isEnabled2FA: meta?.is_enabled2fa,
                    isTrustDevices: meta?.is_trustDevices,
                    isVerify2FA: meta?.is_verify2fa,
                })
            );
            setIsLoading(false);
            return;
        }
        // hiển thị thông báo đăng nhập thành công
        dispatch(
            addToast({
                type: "success",
                title: "Đăng nhập thành công!",
                duration: 3000,
            })
        );
        // thêm thông tin người dùng khi đúng
        dispatch(
            adDataAuth({
                user: resultLogin.data,
            })
        );
        // Tắt auth
        handleOnclose();
        setIsLoading(false);
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
Login.propTypes = {
    className: PropTypes.string,
    handleOnclose: PropTypes.func,
};
export default Login;
