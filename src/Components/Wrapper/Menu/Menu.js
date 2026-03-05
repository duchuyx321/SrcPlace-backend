import PropTypes from "prop-types";
import classNames from "classnames/bind";
import HeadlessTippy from "@tippyjs/react/headless";
import { useState } from "react";

import style from "./Menu.module.scss";
import Wrapper from "~/Components/Wrapper";
import Header from "./Header";
import MenuItem from "./MenuItem";

const cx = classNames.bind(style);

function Menu({
    large = false,
    small = false,
    children,
    items = [],
    hideOnClick = false,
    onClickHide,
    isArrow = true,
    onChange,
    CustomFooter,
    title,
    isImage = false,
    isPrice = false,
}) {
    const resultMenu = (attrs) => {
        return (
            <Wrapper
                large={large}
                isArrow={isArrow}
                small={small}
                tabIndex="-1"
                customFooter={!!CustomFooter && items.length !== 0}
                {...attrs}
            >
                <Header title={title} />
                {items.length === 0 ? (
                    <p className={cx("not_item")}>Chưa có sản phẩm!</p>
                ) : (
                    items.map((item, index) => {
                        return (
                            <MenuItem
                                isImage={isImage}
                                isPrice={isPrice}
                                onChange={onChange}
                                key={index}
                                item={item}
                            />
                        );
                    })
                )}
                {CustomFooter && items.length !== 0 && <CustomFooter />}
            </Wrapper>
        );
    };
    return (
        <HeadlessTippy
            delay={[0, 700]}
            offset={[8, 12]}
            visible={hideOnClick}
            placement="bottom-end"
            interactive
            appendTo={document.body}
            render={(attrs) => resultMenu(attrs)}
            onClickOutside={() => onClickHide(false)}
        >
            {children}
        </HeadlessTippy>
    );
}

Menu.propTypes = {
    large: PropTypes.bool,
    small: PropTypes.bool,
    children: PropTypes.node.isRequired,
    items: PropTypes.array,
    hideOnClick: PropTypes.bool,
    onChange: PropTypes.func,
    isArrow: PropTypes.bool,
    isImage: PropTypes.bool,
    isPrice: PropTypes.bool,
};

export default Menu;
