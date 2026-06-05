import classNames from "classnames/bind";
import PropTypes from "prop-types";
import { FaAngleLeft } from "react-icons/fa6";

import style from "./Menu.module.scss";

const cx = classNames.bind(style);

function Header({ title, className, onBack }) {
    return (
        <header className={cx("header", className)}>
            {onBack && (
                <button className={cx("btn_back")}>
                    <FaAngleLeft />
                </button>
            )}
            <h4 className={cx("title")}>{title}</h4>
        </header>
    );
}

Header.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    onBack: PropTypes.func,
};

export default Header;
