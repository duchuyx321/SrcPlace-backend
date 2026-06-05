import classNames from "classnames/bind";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import style from "./BoxInput.module.scss";
import { addToast } from "~/Features/Toast/toastSlice";
import { useDebounce } from "~/Hooks";

const cx = classNames.bind(style);

const menuRegex = {
    usernameOrEmail: /^.{6,}$/,
    username: /^[a-zA-Z0-9_]{6,20}$/,
    password:
        /^(?=\S+$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,20}$/,
    repeatPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,20}$/,
    email: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
    first_name: /^[a-zA-ZÀ-ỹ\s'-]{2,15}$/,
    last_name: /^[a-zA-ZÀ-ỹ\s'-]{2,15}$/,
};
const menuWarning = {
    usernameOrEmail: "Phải từ 6 ký tự trở lên!",
    username: "6–20 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới!",
    password:
        "8–20 ký tự, không khoảng trắng, có ít nhất 1 chữ thường, 1 chữ in hoa, 1 số và 1 ký tự đặc biệt!",
    email: "Sai định dạng email!",
    first_name: "2–15 ký tự, bao gồm chữ có dấu, khoảng trắng,",
    last_name: "2–15 ký tự, bao gồm chữ có dấu, khoảng trắng,",
};

const defaultFnc = () => {};

function BoxInput({
    id = "",
    title = "",
    isCheck = true,
    isPassword = false,
    isRequired = false,
    handleSetValue = defaultFnc,
    isError = false,
    className,
}) {
    const [value, setValue] = useState("");
    const [check, setCheck] = useState("");
    const [isShowPass, setIsShowPass] = useState(isPassword);
    const debounce = useDebounce(value, 800);
    const dispatch = useDispatch();
    const inputRef = useRef();
    useEffect(() => {
        if (isError && inputRef.current) {
            inputRef.current.focus();
            setCheck("error");
        }
    }, [isError]);
    useEffect(() => {
        if (!debounce) {
            return;
        }
        if (!isCheck) return;
        if (isCheck && !menuRegex[id].test(debounce)) {
            setCheck("warning");
            dispatch(
                addToast({
                    type: "warning",
                    title: `${title} ${menuWarning[id]}`,
                    duration: 3000,
                })
            );
            handleSetValue({ key: id, value: "" });
            return;
        }
        setCheck("success");
        handleSetValue({ key: id, value: debounce.trim() });
    }, [debounce]);
    const handleOnInput = (e) => {
        setValue(e.target.value);
    };
    const handleOnShowPass = () => {
        setIsShowPass(!isShowPass);
    };
    return (
        <div className={cx("wrapper", { [className]: className })}>
            <div
                className={cx("box_input", { [check]: check, error: isError })}
            >
                <input
                    ref={inputRef}
                    value={value}
                    type={isShowPass ? "password" : "text"}
                    id={id}
                    name={id}
                    placeholder=" "
                    autoComplete="off"
                    onInput={(e) => handleOnInput(e)}
                />
                <label htmlFor={id}>
                    {title}
                    {isRequired && <span className={cx("isRequired")}>*</span>}
                </label>
                {isPassword && (
                    <button
                        className={cx("btn_eye")}
                        onClick={() => handleOnShowPass()}
                    >
                        {isShowPass ? <FaEyeSlash /> : <FaEye />}
                    </button>
                )}
            </div>
        </div>
    );
}

export default BoxInput;
