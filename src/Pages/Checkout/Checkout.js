import classNames from "classnames/bind";
import { useSelector, useDispatch } from "react-redux";

import style from "./Checkout.module.scss";
import Seo from "~/Components/Seo";
import {
    selectCheckoutItems,
    selectIsFetchedCheckout,
} from "~/Features/Checkout/checkoutSelect";

import Product from "./Components/Product";
import { useFetch } from "~/Hooks";
import Action from "./Components/Action";
import CheckoutService from "~/Services/CheckoutService";
import {
    updateCheckout,
    recalculateFinalTotal,
    calculateTotalBuy,
} from "~/Features/Checkout/checkoutSlice";

const cx = classNames.bind(style);

function Checkout() {
    const items = [0, 0, 0]; //useSelector(selectCheckoutItems);
    const isFetched = useSelector(selectIsFetchedCheckout);
    const dispatch = useDispatch();

    const handleFetchApiCheckOut = async () => {
        // call api lấy các thông tin thêm vào check out
        const result = await CheckoutService.getCheckout();
        if (!result.error) {
            dispatch(
                updateCheckout({
                    products: result.products,
                    vouchers: result.vouchers,
                })
            );
            dispatch(calculateTotalBuy());
            dispatch(recalculateFinalTotal());
        }
    };
    useFetch({
        handleOnInside: handleFetchApiCheckOut,
        isFetchedList: [isFetched],
    });
    const handleOnBuy = async (vouchers, methods) => {
        const product_IDs = items;
        // call api mua hàng
        console.log({ product_IDs, vouchers });
    };
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
                    <Action
                        totalProducts={items.length}
                        handleOnBuy={handleOnBuy}
                    />
                </div>
            </div>
        </>
    );
}

export default Checkout;
