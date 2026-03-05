import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";

import style from "./OTPInput.module.scss";
import { useDebounce } from "~/Hooks";

const cx = classNames.bind(style);
const defaultFnc = () => {};

function OTPInput({ length = 6, handleOnSetOTP = defaultFnc }) {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);
    const debounce = useDebounce(otp, 1000);
    useEffect(() => {
        if (!debounce) return;

        handleOnSetOTP(debounce.join(""));
    }, [debounce]);
    const onChangeInput = (e, index) => {
        const value = e.target.value;
        const newOtp = [...otp];
        newOtp[index] = value.trim().toUpperCase();
        setOtp(newOtp);
        if (value && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus(); // chuyển focus về ô trước
        }
    };
    const handlePaste = (e) => {
        e.preventDefault(); // Ngăn paste mặc định
        const pasteData = e.clipboardData.getData("Text").trim().toUpperCase();
        if (pasteData) {
            const newOtp = [...otp];
            for (let i = 0; i < length; i++) {
                newOtp[i] = pasteData[i] || "";
            }
            setOtp(newOtp);
            // Focus vào ô tiếp theo cuối cùng có ký tự
            const nextIndex = Math.min(pasteData.length, length - 1);
            inputRefs.current[nextIndex]?.focus();
        }
    };
    return (
        <div className={cx("wrapper")}>
            {otp.map((item, index) => (
                <input
                    className={cx("otpInput")}
                    key={index}
                    type="text"
                    maxLength={1}
                    value={item}
                    onChange={(e) => onChangeInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={(e) => handlePaste(e)}
                    ref={(el) => (inputRefs.current[index] = el)}
                />
            ))}
        </div>
    );
}

export default OTPInput;
