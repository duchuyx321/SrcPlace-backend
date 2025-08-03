import classNames from "classnames/bind";

import style from "./Setting.module.scss";

const cx = classNames.bind(style);

function Setting() {
    return <div className={cx("wrapper")}></div>;
}

export default Setting;
