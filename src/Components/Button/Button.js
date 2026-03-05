import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

import style from "./Button.module.scss";

const cx = classNames.bind(style);

function Button({
    small = false,
    large = false,
    text = false,
    disable = false,
    primary = false,
    outline = false,
    leftIcon,
    rightIcon,
    className,
    to,
    href,
    onClick,
    children,
    ...passProps
} = {}) {
    let props = {
        onClick,
        ...passProps,
    };
    // delete event
    if (disable) {
        Object.keys(props).forEach((event) => {
            if (event.startsWith("on") && typeof props[event] === "function") {
                delete props[event];
            }
        });
    }
    let Component = "button";
    if (to) {
        props.to = to;
        Component = Link;
    } else if (href) {
        props.href = href;
        Component = "a";
    }
    const classes = cx("wrapper", {
        [className]: className,
        primary,
        outline,
        small,
        large,
        text,
        disable,
    });
    return (
        <Component className={classes} {...props}>
            {leftIcon && <span className={cx("icon")}>{leftIcon}</span>}
            <h3 className={cx("title")}>{children}</h3>
            {rightIcon && <span className={cx("icon")}>{rightIcon}</span>}
        </Component>
    );
}

Button.propTypes = {
    primary: PropTypes.bool,
    outline: PropTypes.bool,
    small: PropTypes.bool,
    large: PropTypes.bool,
    text: PropTypes.bool,
    disable: PropTypes.bool,
    classNames: PropTypes.string,
    to: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    children: PropTypes.node.isRequired,
};

export default Button;
