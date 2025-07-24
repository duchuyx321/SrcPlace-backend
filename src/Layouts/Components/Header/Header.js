import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import style from "./Header.module.scss";
import Image from "~/Components/Image";
import image from "~/Assets/images";
import Button from "~/Components/Button";
import UserActions from "~/Layouts/Components/Header/Components/UserActions";
import Me from "~/Components/Me";
import Search from "~/Components/Search";
import { Link } from "react-router-dom";
import config from "~/Config";
import { openAuthModal } from "~/Features/AuthModal/authModalSlice";
import { selectIsLoginAuth } from "~/Features/Auth/AuthSelect";

const cx = classNames.bind(style);
function Header({ is_searchHeader = true }) {
    const dispatch = useDispatch();
    const isLogin = useSelector(selectIsLoginAuth);
    // useEffect;
    useEffect(() => {
        const AccessToken = localStorage.getItem("AccessToken");
        // setIsLogin(!!AccessToken);
    }, []);
    const handleOnOpenAuth = (isFormLogin) => {
        dispatch(openAuthModal({ isFormLogin: isFormLogin }));
    };
    return (
        <div className={cx("wrapper")}>
            <div className={cx("left")}>
                <Link to={config.routers.home} className={cx("comeHome")}>
                    <Image
                        className={cx("logo")}
                        src={image.logoWhiteImage}
                        alt="Logo SrcPlace"
                    />
                    <h3>Thư Viện Đồ Án</h3>
                </Link>
            </div>
            {is_searchHeader && <Search />}
            <div className={cx("right")}>
                {isLogin ? (
                    <div className={cx("right_wrapper")}>
                        <UserActions />
                        <Me />
                    </div>
                ) : (
                    <>
                        <Button
                            className={cx("btn_login")}
                            primary
                            onClick={() => handleOnOpenAuth(true)}
                        >
                            Đăng nhập
                        </Button>
                        <Button
                            className={cx("btn_register")}
                            primary
                            onClick={() => handleOnOpenAuth(false)}
                        >
                            Đăng kí
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Header;
