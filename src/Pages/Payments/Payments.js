import classNames from "classnames/bind";

import style from "./Payments.module.scss";

const cx = classNames.bind(style);

function Payments() {
    return <div className={cx("wrapper")}></div>;
}

export default Payments;
