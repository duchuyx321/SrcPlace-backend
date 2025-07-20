import classNames from "classnames/bind";

import style from "./Avatar.module.scss";

const cx = classNames.bind(style);
function Avatar() {
    return <div className={cx("wrapper")}></div>;
}

export default Avatar;
