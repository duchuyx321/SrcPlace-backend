import classNames from "classnames/bind";
import { useSelector } from "react-redux";
import { useState } from "react";

import style from "./Action.module.scss";
import { selectCheckoutTotal } from "~/Features/Checkout/checkoutSelect";
import { formatNumberPrice } from "~/Util/lib/formatNumberPrice";
import Button from "~/Components/Button";
import BoxInput from "~/Components/BoxInput";

const cx = classNames.bind(style);
const defaultFnc = () => {};
function Action({ totalProducts = 1, handleOnBuy = defaultFnc }) {
    let total = useSelector(selectCheckoutTotal);
    const [voucher, setVoucher] = useState([]);
    return (
        <div className={cx("wrapper")}>
            <div className={cx("action_voucher")}>
                <div className={cx("voucher")}>
                    <BoxInput
                        id="voucher"
                        title="Voucher"
                        isCheck={false}
                        isError={false}
                    />
                    <Button primary className={cx("btn_applyVoucher")}>
                        Áp dụng
                    </Button>
                </div>
            </div>
            <div className={cx("action_payment")}>
                <div className={cx("general")}>
                    <p>{`Tổng cộng(${totalProducts} sản phẩm): `}</p>
                    <span>
                        {formatNumberPrice({ number: total || 500000 })}
                    </span>
                </div>
                <Button
                    primary
                    className={cx("btn_buy")}
                    onClick={() => handleOnBuy()}
                >
                    Mua Ngay
                </Button>
            </div>
        </div>
    );
}

export default Action;
