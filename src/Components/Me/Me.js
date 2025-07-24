/* eslint-disable react-hooks/exhaustive-deps */
import classNames from "classnames/bind";
import { IoCashOutline, IoSettingsOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { CiShoppingBasket } from "react-icons/ci";
import { useMemo, useState } from "react";

import style from "./Me.module.scss";
import Image from "~/Components/Image";
import Menu from "~/Components/Wrapper/Menu";

const cx = classNames.bind(style);
const MenuItemUser = [
    {
        key: "wallet",
        to: "/wallet",
        name: "Lịch Sử Nạp Tiền",
        icon: <IoCashOutline />,
    },
    {
        key: "payment",
        to: "/payment",
        name: "Lịch sử Mua Hàng",
        icon: <CiShoppingBasket />,
    },
];
const MenuItemAdmin = [{}, {}];
const MenuItemPublic = [
    {
        key: "setting",
        to: "/setting",
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
    let role = "User";
    const [isHide, setIsHide] = useState(false);
    const MenuItem = useMemo(() => {
        if (role) {
            if (role === "User") {
                return [...MenuItemUser, ...MenuItemPublic];
            } else if (role === "Admin") {
                return [...MenuItemAdmin, ...MenuItemPublic];
            }
        }
    }, []);

    const handleOnHide = () => {
        setIsHide(!isHide);
    };
    const handleOnChange = (item) => {
        const innerText = item.target.innerText;
        switch (innerText) {
            case "Đăng Xuất":
                console.log(true);
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
                <Image src={""} alt="Avatar user" />
            </button>
        </Menu>
    );
}

export default Me;
