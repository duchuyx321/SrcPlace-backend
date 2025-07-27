import classNames from "classnames/bind";
import { useSelector } from "react-redux";

import style from "./Checkout.module.scss";
import Seo from "~/Components/Seo";
import {
    selectCheckoutItems,
    selectCheckoutTotal,
    selectIsFetchedCheckout,
} from "~/Features/Checkout/checkoutSelect";

import Product from "./Components/Product";
import { useFetch } from "~/Hooks";
import Action from "./Components/Action";

const cx = classNames.bind(style);

function Checkout() {
    const items = [0, 0, 0, 0, 0, 0, 0, 0]; //useSelector(selectCheckoutItems);
    const isFetched = useSelector(selectIsFetchedCheckout);

    const handleFetchApiCheckOut = () => {
        // call api lấy các thông tin thêm vào check out
    };
    useFetch({
        handleOnInside: handleFetchApiCheckOut,
        isFetchedList: [isFetched],
    });
    return (
        <>
            <Seo
                title="Thanh Toán | SrcPlace"
                description="Trang Thanh Toán của SrcPlace để thanh toán đơn hàng của bạn."
            />
            <div className={cx("wrapper")}>
                <div className={cx("header")}>
                    <div className={cx("item")}>
                        <p className={cx("product")}>Sản Phẩm</p>
                        <p className={cx("amount")}>Giá Tiền</p>
                    </div>
                </div>
                <div className={cx("products")}>
                    {items.map((product, index) => (
                        <Product key={index} data={product} />
                    ))}
                </div>
                <div className={cx("action")}>
                    <Action totalProducts={items.length} />
                </div>
            </div>
        </>
    );
}

export default Checkout;
