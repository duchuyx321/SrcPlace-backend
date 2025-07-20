import classNames from "classnames/bind";
import { useState } from "react";
import { RiLoader2Line } from "react-icons/ri";

import style from "./Register.module.scss";
import BoxInput from "../BoxInput";
import Button from "~/Components/Button";
import useRegisterVariables from "./useRegisterVariables";

const cx = classNames.bind(style);

const MenuValid = [
    { id: "email", title: "Email", isRequired: true },
    { id: "username", title: "Username", isRequired: true },
    { id: "password", title: "Mật khẩu", isPassword: true, isRequired: true },
];

function Register({ className = "" }) {
    const [isLoading, setIsLoading] = useState(false);
    const { form, handleOnAddVariables, isValid } = useRegisterVariables();
    const handleOnSubmit = () => {
        setIsLoading(true);
        // call api

        setIsLoading(false);
    };
    return (
        <div className={cx("wrapper", { [className]: className })}>
            <div className={cx("container")}>
                <div className={cx("name")}>
                    <BoxInput
                        id="firstName"
                        title="First Name"
                        handleSetValue={handleOnAddVariables}
                        isRequired
                    />
                    <BoxInput
                        id="lastName"
                        title="Last Name"
                        handleSetValue={handleOnAddVariables}
                        isRequired
                    />
                </div>
                {MenuValid.map((item, index) => (
                    <BoxInput
                        key={index}
                        id={item.id}
                        title={item.title}
                        isPassword={item.isPassword ?? false}
                        isRequired={item.isRequired ?? false}
                        handleSetValue={handleOnAddVariables}
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
