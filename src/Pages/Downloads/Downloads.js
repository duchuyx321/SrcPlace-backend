import classNames from "classnames/bind";

import style from "./Downloads.module.scss";

const cx = classNames.bind(style);

function Downloads() {
    return <div className={cx("wrapper")}>Downloads page</div>;
}

export default Downloads;
