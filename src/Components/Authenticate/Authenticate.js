import classNames from "classnames/bind";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Tippy from "@tippyjs/react/headless";
import { FaAngleDown } from "react-icons/fa6";
import { useSelector } from "react-redux";

import style from "./Authenticate.module.scss";
import Button from "~/Components/Button";
import OTPInput from "./OTPInput";

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
    const [otp, setOtp] = useState("");
    const isValid = otp.length === 6;

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
                    {isCloseModal && (
                        <Button primary className={cx("btn_close")}>
                            Trở về
                        </Button>
                    )}
                    <Button
                        disable={!isValid}
                        primary
                        className={cx("btn_close")}
                    >
                        Xác Thực
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Authenticate;
