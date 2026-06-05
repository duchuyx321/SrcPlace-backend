import classNames from "classnames/bind";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import style from "./Modal.module.scss";
import Button from "~/Components/Button";
import { closeModal, clickBtnModal } from "~/Features/Modal/modalSlice";
import {
    selectResultModal,
    selectIsCloseModal,
} from "~/Features/Modal/modalSelect";

const cx = classNames.bind(style);

function Modal() {
    const [isClose, setIsClose] = useState(false);
    const dispatch = useDispatch();
    const { isEventCloseModal, type, title, description, titleBtnConfirm } =
        useSelector(selectResultModal);
    const isCloseModal = useSelector(selectIsCloseModal);
    useEffect(() => {
        if (!isCloseModal) return;
        setTimeout(() => {
            dispatch(closeModal());
        }, 300);
    }, [isCloseModal]);
    const handleOnCancel = () => {
        setIsClose(true);
        dispatch(
            clickBtnModal({
                key: "isClickBtnCancel",
            })
        );
    };
    const handleConfirm = () => {
        dispatch(
            clickBtnModal({
                key: "isClickBtnConfirm",
            })
        );
    };
    return (
        <div className={cx("wrapper", { fadeOut: isClose })}>
            <div className={cx("container")}>
                <div className={cx("title")}>
                    <h3>{title || "Phát hiện đăng nhập khác!"}</h3>
                    <p>
                        {description ||
                            "Tài khoản của bạn đang được đăng nhập trên một thiết bị khác đã được tin cậy. Nếu đó không phải là bạn, hãy đổi mật khẩu ngay. Chúng tôi sẽ đăng xuất các thiết bị khác để đảm bảo chỉ một thiết bị được duy trì đăng nhập."}
                    </p>
                </div>
                <div className={cx("action")}>
                    <Button
                        outline
                        small
                        className={cx("btn_cancel")}
                        onClick={() => handleOnCancel()}
                    >
                        Hủy Bỏ
                    </Button>
                    <Button
                        primary
                        small
                        className={cx("btn_confirm", {
                            [type]: type,
                        })}
                        onClick={() => handleConfirm()}
                    >
                        {titleBtnConfirm || "Xác nhận"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

Modal.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    handleConfirm: PropTypes.func,
    isEvenCloseModal: PropTypes.bool,
    info: PropTypes.bool,
    success: PropTypes.bool,
    warning: PropTypes.bool,
    error: PropTypes.bool,
};

export default Modal;
