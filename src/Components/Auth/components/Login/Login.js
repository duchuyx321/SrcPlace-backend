import classNames from "classnames/bind";
import { RiLoader2Line } from "react-icons/ri";

import style from "./Login.module.scss";
import BoxInput from "../BoxInput";
import Button from "~/Components/Button";
import { useState } from "react";

const cx = classNames.bind(style);

function Login({ className = "" }) {
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    // handle add variables
    const handleOnAddVariables = ({ key = "", value = "" } = {}) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };
    //  check variables
    const isValid = Object.values(form).every((item) => item.trim() !== "");
    const handleOnSubmit = () => {
        setIsLoading(true);
        // call api

        setIsLoading(false);
    };
    return (
        <div className={cx("wrapper", { [className]: className })}>
            <div className={cx("container")}>
                <BoxInput
                    id="username"
                    title="Username or Email"
                    isCheck={false}
                    isRequired
                    handleSetValue={handleOnAddVariables}
                />
                <BoxInput
                    id="password"
                    title="Mật khẩu"
                    isPassword
                    isRequired
                    handleSetValue={handleOnAddVariables}
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
