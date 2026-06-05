import classNames from "classnames/bind";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useState } from "react";

import style from "./Action.module.scss";
import BoxInput from "~/Components/BoxInput";
import Button from "~/Components/Button";
import { formatNumberPrice } from "~/Util/lib/formatNumberPrice";

const cx = classNames.bind(style);
const defaultFnc = () => {};
function Vouchers({
    vouchers = [],
    handleOnRemoveVoucher = defaultFnc,
    handleOnAddVoucher = defaultFnc,
}) {
    const [voucher, setVoucher] = useState({});

    return (
        <>
            <div className={cx("voucher")}>
                <BoxInput
                    id="voucher"
                    title="Voucher"
                    isCheck={false}
                    isError={false}
                    handleSetValue={setVoucher}
                    className={cx("input_voucher")}
                />
                <Button
                    disable={!voucher}
                    primary
                    className={cx("btn_applyVoucher")}
                    onClick={() => handleOnAddVoucher(voucher.value)}
                >
                    Áp dụng
                </Button>
            </div>
            {vouchers.length === 0 && (
                <div className={cx("voucher_summer")}>
                    {vouchers.map((item, index) => (
                        <div key={index} className={cx("voucher_apply")}>
                            <p className={cx("voucher_code")}>{item.code}</p>
                            <p
                                className={cx("voucher_discount")}
                            >{`-${formatNumberPrice({
                                number: item.discount,
                            })}`}</p>
                            <button
                                className={cx("btn_removeVoucher")}
                                onClick={() => handleOnRemoveVoucher(item.code)}
                            >
                                <IoCloseCircleOutline />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default Vouchers;
