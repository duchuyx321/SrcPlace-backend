import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { RiLoader2Line } from "react-icons/ri";
import { useDispatch } from "react-redux";

import style from "./Register.module.scss";
import BoxInput from "../BoxInput";
import Button from "~/Components/Button";
import useRegisterVariables from "./useRegisterVariables";
import AuthService from "~/Services/AuthService";
import { adDataAuth } from "~/Features/Auth/AuthSlice";
import { startVerifying } from "~/Features/Verify/VerifySlice";
import { addToast } from "~/Features/Toast/toastSlice";

const cx = classNames.bind(style);

const MenuValid = [
    { id: "username", title: "Username", isRequired: true },
    { id: "email", title: "Email", isRequired: true },
    { id: "password", title: "Mật khẩu", isPassword: true, isRequired: true },
];

function Register({ className = "" }) {
    const [isLoading, setIsLoading] = useState(false);
    const { form, handleOnAddVariables, isValid } = useRegisterVariables();
    const [errorKey, setErrorKey] = useState("");
    const dispatch = useDispatch();
    const handleOnSubmit = async () => {
        setIsLoading(true);
        // call api
        const result = await AuthService.register({ form });
        setIsLoading(false);
        if (result.error) {
            dispatch(
                addToast({
                    type: "error",
                    title: result.error.message,
                    duration: 3000,
                })
            );
            setErrorKey(result.error.key);
            handleOnAddVariables({ key: result.error?.key, value: "" });
            return;
        }
        localStorage.setItem("TempToken", result.meta.TempToken);
        dispatch(adDataAuth({ user: result.data }));
        // hiện thị xác thực gmail
        dispatch(
            startVerifying({
                email: form.email,
                isClose: false,
                title: "Xác thực tài khoản",
                description:
                    "Mã xác thực gồm 6 kí tự và hết hạn sau 60s. Hãy xác thực để tránh bị mất dữ liệu hoặc có một trải nghiệm không tốt",
                isShowListMethod: false,
            })
        );
    };
    return (
        <div className={cx("wrapper", { [className]: className })}>
            <div className={cx("container")}>
                <div className={cx("name")}>
                    <BoxInput
                        id="first_name"
                        title="First Name"
                        handleSetValue={handleOnAddVariables}
                        isRequired
                        isError={errorKey === "first_name"}
                    />
                    <BoxInput
                        id="last_name"
                        title="Last Name"
                        handleSetValue={handleOnAddVariables}
                        isRequired
                        isError={errorKey === "last_name"}
                    />
                </div>
                {MenuValid.map((item) => (
                    <BoxInput
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        isPassword={item.isPassword ?? false}
                        isRequired={item.isRequired ?? false}
                        handleSetValue={handleOnAddVariables}
                        isError={errorKey === item.id}
                    />
                ))}
            </div>
            <div className={cx("action")}>
                <Button
                    primary
                    large
                    disable={!isValid || isLoading}
                    className={cx("btn_submit")}
                    onClick={() => handleOnSubmit()}
                >
                    Đăng Kí
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

export default Register;
