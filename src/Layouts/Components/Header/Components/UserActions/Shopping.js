import PropTypes from "prop-types";
import classNames from "classnames/bind";
import { BsFillCartFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import style from "./UserActions.module.scss";
import Menu from "~/Components/Wrapper/Menu";
import {
    selectIsFetchedCart,
    selectTotalProduct,
    selectCartItems,
} from "~/Features/Cart/cartSelect";
import { getDataToCart } from "~/Features/Cart/cartSlice";
import { useFetch } from "~/Hooks";
import CartService from "~/Services/CartService";
import Button from "~/Components/Button";
import config from "~/Config";

const cx = classNames.bind(style);
function Shopping() {
    const [isHidden, setIsHidden] = useState(false);
    const cartItems = useSelector(selectCartItems);
    const totalProduct = useSelector(selectTotalProduct);
    const dispatch = useDispatch();
    const isFetchedCart = useSelector(selectIsFetchedCart);
    const handleOnFetchApiCart = async () => {
        const resultDataCart = await CartService.getCarts();
        dispatch(
            getDataToCart({
                notifications: resultDataCart,
            })
        );
    };
    useFetch({
        handleOnInside: handleOnFetchApiCart,
        isFetchedList: [isFetchedCart],
    });
    const handleHidden = () => {
        setIsHidden(!isHidden);
    };
    const CustomFooter = () => {
        return (
            <div className={cx("action")}>
                <Button
                    to={config.routers.viewCart}
                    primary
                    className={cx("btn_viewCart")}
                >
                    Xem giỏ hàng
                </Button>
            </div>
        );
    };
    return (
        <Menu
            hideOnClick={isHidden}
            large
            title="Giỏ Hàng"
            items={cartItems}
            onClickHide={setIsHidden}
            isImage
            isPrice
            CustomFooter={CustomFooter}
        >
            <button
                onClick={() => handleHidden()}
                className={cx("wrapper_event", { isHidden })}
            >
                {totalProduct !== 0 && (
                    <div className={cx("count")}>{totalProduct}</div>
                )}
                <span className={cx("icon")}>
                    <BsFillCartFill />
                </span>
            </button>
        </Menu>
    );
}

export default Shopping;
