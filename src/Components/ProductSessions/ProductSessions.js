import classNames from "classnames/bind";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FaAnglesRight } from "react-icons/fa6";

import style from "./ProductSessions.module.scss";
import Button from "~/Components/Button";
import Product from "~/Components/Product";

const cx = classNames.bind(style);

function ProductSessions({
    title = "",
    to = "",
    className = "",
    products = [],
    is_animation = false,
    is_more = true,
}) {
    const [itemAction, setItemAction] = useState(0);
    const [isHover, setIsHover] = useState(true);
    useEffect(() => {
        if (is_animation) {
            const interval = setInterval(() => {
                setItemAction((item) => {
                    return item >= products.length - 1 ? 0 : item + 1;
                });
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [products.length, is_animation]);

    const handleOnMouseEnter = () => {
        setIsHover(false);
    };
    const handleOnMouseLeave = () => {
        setIsHover(true);
    };
    return (
        <div className={cx("wrapper", className)}>
            <div className={cx("extend")}>
                <h3>{title}</h3>
                {is_more && (
                    <Button
                        text
                        to={to}
                        className={cx("products_more")}
                        rightIcon={<FaAnglesRight />}
                    >
                        Xem Thêm
                    </Button>
                )}
            </div>
            <div className={cx("products_item")}>
                {products.map((product, index) => (
                    <Product
                        key={index}
                        className={cx("product")}
                        is_action={
                            is_animation && isHover && itemAction === index
                        }
                        item={product}
                        handleOnMouseEnter={handleOnMouseEnter}
                        handleOnMouseLeave={handleOnMouseLeave}
                    />
                ))}
            </div>
        </div>
    );
}

ProductSessions.propTypes = {
    title: PropTypes.string,
    to: PropTypes.string,
    className: PropTypes.string,
    products: PropTypes.array.isRequired,
    is_animation: PropTypes.bool,
    is_more: PropTypes.bool,
};

export default ProductSessions;
