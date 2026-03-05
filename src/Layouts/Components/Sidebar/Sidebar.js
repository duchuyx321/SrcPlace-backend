import classNames from "classnames/bind";
import { AiFillHome, AiFillTags } from "react-icons/ai";

import { LuAlignJustify } from "react-icons/lu";
import { NavLink } from "react-router-dom";

import style from "./Sidebar.module.scss";
import config from "~/Config";

const cx = classNames.bind(style);
const MenuSidebars = [
    {
        key: "Home",
        to: config.routers.home,
        name: "Home",
        icon: <AiFillHome />,
    },
    {
        key: "category",
        to: config.routers.products,
        name: "Sản Phẩm",
        icon: <LuAlignJustify />,
    },
    {
        key: "tags",
        to: config.routers.tutorial,
        name: "Hướng Dẫn",
        icon: <AiFillTags />,
    },
];

function Sidebar() {
    return (
        <div className={cx("wrapper")}>
            {MenuSidebars.map((item) => (
                <NavLink
                    key={item.key}
                    to={item.to}
                    className={(e) =>
                        cx("btn_sidebar", { isActive: e.isActive })
                    }
                >
                    <span>{item.icon}</span>
                    <h3>{item.name}</h3>
                </NavLink>
            ))}
        </div>
    );
}

export default Sidebar;
