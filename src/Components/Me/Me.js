/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames/bind";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { CiShoppingBasket } from "react-icons/ci";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import style from "./Me.module.scss";
import Image from "~/Components/Image";
import Menu from "~/Components/Wrapper/Menu";
import AuthService from "~/Services/AuthService";
import { selectDataUserAuth } from "~/Features/Auth/AuthSelect";
import config from "~/Config";

const cx = classNames.bind(style);
const MenuItemUser = [
    {
        key: "payments",
        to: config.routers.payments,
        name: "Lịch sử Mua Hàng",
        icon: <CiShoppingBasket />,
    },
];
const MenuItemAdmin = [];
const MenuItemPublic = [
    {
        key: "setting",
        to: config.routers.setting,
        name: "Cài Đặt",
        icon: <IoSettingsOutline />,
    },
    {
        key: "logout",
        name: "Đăng Xuất",
        icon: <IoIosLogOut />,
    },
];

function Me() {
    const [isHide, setIsHide] = useState(false);
    const dataAuth = useSelector(selectDataUserAuth);
    const MenuItem = useMemo(() => {
        if (dataAuth.role === "Admin") {
            return [...MenuItemAdmin, ...MenuItemUser, ...MenuItemPublic];
        }
        return [...MenuItemUser, ...MenuItemPublic];
    }, [dataAuth]);

    const handleOnHide = () => {
        setIsHide(!isHide);
    };
    const handleOnChange = (item) => {
        const innerText = item.key;
        switch (innerText) {
            case "logout":
                AuthService.logout();
                return;
            default:
                return;
        }
    };
    return (
        <Menu
            onClickHide={setIsHide}
            hideOnClick={isHide}
            items={MenuItem}
            onChange={handleOnChange}
            isArrow={false}
            title="Bảng Điều Khiển"
        >
            <button className={cx("wrapper")} onClick={() => handleOnHide()}>
                <Image src={dataAuth.avatar?.image || ""} alt="Avatar user" />
            </button>
        </Menu>
    );
}

export default Me;
