import classNames from "classnames/bind";
import { FaAnglesLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import style from "./SidebarDetail.module.scss";
import Button from "~/Components/Button";

const cx = classNames.bind(style);

const MenuSidebarDefault = [
    {
        title: "Quay Lại",
        icon: <FaAnglesLeft />,
    },
];

function SidebarDetail() {
    const navigate = useNavigate();
    const handleOnBack = () => {
        navigate(-1);
    };
    return (
        <div className={cx("wrapper")}>
            {MenuSidebarDefault.map((item, index) => (
                <Button
                    key={index}
                    className={cx("btn_back")}
                    leftIcon={item.icon}
                    onClick={() => handleOnBack()}
                    text
                >
                    {item.title}
                </Button>
            ))}
        </div>
    );
}

export default SidebarDetail;
