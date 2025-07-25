import classNames from "classnames/bind";
import { TiDelete } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import style from "./Auth.module.scss";
import Other from "./components/Other";
import Login from "./components/Login";
import Register from "./components/Register";
import { selectIsFormLoginAuthModal } from "~/Features/AuthModal/authModalSelect";
import { closeAuthModal } from "~/Features/AuthModal/authModalSlice";

const cx = classNames.bind(style);
function Auth() {
    const isForm = useSelector(selectIsFormLoginAuthModal);
    const [isFormLogin, setIsFromLogin] = useState(isForm);
    const [isClosing, setIsClosing] = useState(false);
    const [isOpenAnimation, setIsOpenAnimation] = useState(true);
    useEffect(() => {
        setIsFromLogin(isForm);
    }, [isForm]);
    const dispatch = useDispatch();
    const handleOnClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            dispatch(closeAuthModal()); // đóng modal sau 300ms
        }, 300);
    };
    const handleOnNext = () => {
        setIsOpenAnimation(false);
        setTimeout(() => {
            setIsFromLogin((prev) => !prev);
            setIsOpenAnimation(true);
        }, 500);
    };
    return (
        <div className={cx("wrapper", { fadeOut: isClosing })}>
            <div className={cx("container")}>
                <button
                    className={cx("btn_close")}
                    onClick={() => handleOnClose()}
                >
                    <TiDelete />
                </button>
                <div className={cx("center")}>
                    <div className={cx("title")}>
                        <h3>{`${
                            isFormLogin ? "Đăng Nhập" : "Đăng Kí"
                        } Vào SrcPlace`}</h3>
                    </div>
                    <div className={cx("content")}>
                        {isFormLogin ? (
                            <Login
                                className={cx("authForm", "login", {
                                    open: isOpenAnimation,
                                    close: !isOpenAnimation,
                                })}
                                handleOnclose={handleOnClose}
                            />
                        ) : (
                            <Register
                                className={cx("authForm", "register", {
                                    open: isOpenAnimation,
                                    close: !isOpenAnimation,
                                })}
                            />
                        )}
                    </div>
                </div>
                <div className={cx("convert")}>
                    <div>
                        <p>
                            {isFormLogin
                                ? "Bạn chưa có tài khoản?"
                                : "Bạn đã có tài khoản?"}
                        </p>
                        <button
                            className={cx("btn_convert")}
                            onClick={() => handleOnNext()}
                        >
                            {isFormLogin ? "Đăng Kí" : "Đăng Nhập"}
                        </button>
                    </div>
                </div>
                <div className={cx("footer")}>
                    <Other />
                </div>
            </div>
        </div>
    );
}

export default Auth;
