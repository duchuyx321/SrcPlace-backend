import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { TiArrowSortedUp } from "react-icons/ti";

import style from "./Wrapper.module.scss";

const cx = classNames.bind(style);

function Wrapper({
    children,
    className,
    isArrow = true,
    small = false,
    large = false,
    customFooter = false,
}) {
    const classes = cx("wrapper", {
        [className]: className,
        small,
        large,
        customFooter,
    });
    return (
        <>
            {isArrow && (
                <span className={cx("arrow")}>
                    <TiArrowSortedUp />
                </span>
            )}
            <div className={classes}>{children}</div>
        </>
    );
}

Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Wrapper;
