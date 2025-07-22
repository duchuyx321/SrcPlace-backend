import classNames from "classnames/bind";
import PropTypes from "prop-types";

import style from "./Authenticate.module.scss";
import Button from "~/Components/Button";
import { useEffect, useState } from "react";

const cx = classNames.bind(style);

function Authenticate({ title, titleButton, isCloseModal = false }) {
    const [isClose, setIsClose] = useState(false);
    useEffect(() => {}, []);
    return (
        <div className={cx("wrapper", { fadeOut: isClose })}>
            <div className={cx("container")}>
                <div className={cx("title")}>
                    <h3>Xác Thực tài khoản</h3>
                    <p>
                        Mã xác thực gồm 6 ký tự, được gửi bởi hệ thống hoặc
                        thông qua ứng dụng bên thứ ba nếu bạn đang sử dụng xác
                        thực hai yếu tố (2FA).
                    </p>
                </div>
                <div className={cx("action")}>
                    {isCloseModal && (
                        <Button primary className={cx("btn_close")}>
                            Trở về
                        </Button>
                    )}
                    <Button disable primary className={cx("btn_close")}>
                        Xác Thực
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Authenticate;
