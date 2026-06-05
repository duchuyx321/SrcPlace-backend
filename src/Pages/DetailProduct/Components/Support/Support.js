import classNames from "classnames/bind";
import { FaCheckCircle, FaCheckDouble } from "react-icons/fa";

import style from "./Support.module.scss";

const cx = classNames.bind(style);

const MenuSupport = [
    {
        title: "Hỗ trợ setup 24/7",
    },
    {
        title: "Video hướng dẫn tải và cài đặt",
    },
    {
        title: "Hỗ trợ khi xảy ra lỗi miễn phí",
    },
];

function Support() {
    return (
        <div className={cx("wrapper")}>
            <div className={cx("title")}>
                <span>
                    <FaCheckDouble />
                </span>
                <p>SrcPlace hỗ trợ kèm theo</p>
            </div>
            <div className={cx("container")}>
                {MenuSupport.map((item, index) => (
                    <div key={index} className={cx("item")}>
                        <span>
                            <FaCheckCircle />
                        </span>
                        <p>{item.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Support;
