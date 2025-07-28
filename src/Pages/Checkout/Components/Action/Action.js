import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import style from "./Action.module.scss";
import {
    selectCheckoutTotal,
    selectVouchersCheckout,
    selectFinalTotalCheckout,
} from "~/Features/Checkout/checkoutSelect";
import {
    recalculateFinalTotal,
    removeVoucher,
    addVoucher,
} from "~/Features/Checkout/checkoutSlice";
import { formatNumberPrice } from "~/Util/lib/formatNumberPrice";
import Button from "~/Components/Button";
import Image from "~/Components/Image";
import CheckoutService from "~/Services/CheckoutService";
import Vouchers from "./Voucher";
import paymentMethodService from "~/Services/paymentMethodService";

const cx = classNames.bind(style);
const defaultFnc = () => {};
function Action({ totalProducts = 1, handleOnBuy = defaultFnc }) {
    const total = useSelector(selectCheckoutTotal);
    const finalTotal = useSelector(selectFinalTotalCheckout);
    const vouchers = useSelector(selectVouchersCheckout);
    const [method, setMethod] = useState({});
    const [listMethod, setListMethod] = useState([]);
    const dispatch = useDispatch();
    const handleOnFetchApiPaymentMethod = async () => {
        const result = await paymentMethodService.getPaymentMethods();
        if (!result.error) {
            setListMethod(result);
            const initialMethod = {};
            // call api payment method
            result.forEach((item, index) => {
                initialMethod[item.code] = index === 0;
            });
            setMethod(initialMethod);
        }
    };
    useEffect(() => {}, []);
    // handle
    const handleOnChangeRadio = (id) => {
        setMethod((methods) => {
            const newMethods = {};
            Object.keys(methods).forEach((key) => {
                newMethods[key] = key === id;
            });
            return newMethods;
        });
    };
    const handleOnRemoveVoucher = async (code) => {
        // call api xóa voucher
        const resultRemoveVoucher = await CheckoutService.removeVoucherCheckout(
            { voucher_IDs: [code] }
        );
        if (!resultRemoveVoucher.error) {
            // dispatch xóa voucher
            dispatch(removeVoucher({ code }));
            dispatch(recalculateFinalTotal());
        }
    };
    const handleOnAddVoucher = async (code) => {
        // call api thêm token
        dispatch(
            addVoucher({
                code,
            })
        );
    };
    return (
        <div className={cx("wrapper")}>
            <div className={cx("action_paymentMethod")}>
                <div className={cx("paymentMethods")}>
                    <h3>Chọn phương thức thanh toán </h3>
                    <div className={cx("methods")}>
                        {listMethod.map((item, index) => (
                            <label
                                key={index}
                                htmlFor={`radio${index}`}
                                className={cx("method")}
                            >
                                <div className={cx("name_method")}>
                                    <Image
                                        src={item.logo?.image_url}
                                        alt="logo"
                                    />
                                    <p>{item.name}</p>
                                </div>
                                <input
                                    type="radio"
                                    id={`radio${index}`}
                                    className={cx("checkbox")}
                                    checked={method[item.code] || false}
                                    onChange={() =>
                                        handleOnChangeRadio(item.code)
                                    }
                                />
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            <div className={cx("right")}>
                <div className={cx("action_voucher")}>
                    {/* <Vouchers
                        vouchers={vouchers}
                        handleOnRemoveVoucher={handleOnRemoveVoucher}
                    /> */}
                </div>
                <div className={cx("action_payment")}>
                    <div className={cx("general")}>
                        <p>{`Tổng cộng(${totalProducts} sản phẩm): `}</p>
                        {vouchers.length !== 0 && (
                            <span className={cx("total")}>
                                {formatNumberPrice({
                                    number: total || 500000,
                                })}
                            </span>
                        )}
                        <span>
                            {formatNumberPrice({
                                number: finalTotal || 500000,
                            })}
                        </span>
                    </div>

                    <Button
                        primary
                        className={cx("btn_buy")}
                        onClick={() => handleOnBuy(vouchers, method)}
                    >
                        Mua Ngay
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Action;
