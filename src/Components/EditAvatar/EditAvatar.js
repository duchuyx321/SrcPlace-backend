import classNames from "classnames/bind";
import { useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { TiDelete } from "react-icons/ti";
import { FaRegEdit } from "react-icons/fa";
import PropTypes from "prop-types";

import style from "./EditAvatar.module.scss";
import Button from "~/Components/Button";
import { closeAuthModal } from "~/Features/AuthModal/authModalSlice";
import { closeAvatarModal } from "~/Features/AvatarModal/AvatarModalSlice";
import Image from "../Image";
import images from "~/Assets/images";
import AvatarCropper from "./AvatarCropper";

const cx = classNames.bind(style);
function EditAvatar({ addAvatar = false }) {
    const dispatch = useDispatch();
    const [isClosing, setIsClosing] = useState(false);
    const [avatar, setAvatar] = useState("");
    const [isAvatar, setIsAvatar] = useState(false);
    const inputRef = useRef();
    const handleOnClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            dispatch(closeAvatarModal()); // đóng modal sau 300ms
        }, 300);
    };
    const handleOnClickImage = () => {
        inputRef.current.click();
    };
    const handleInputImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
        }
        setIsAvatar(true);
    };
    const handleOnCropImage = (avatar) => {
        setAvatar(avatar);
        setIsAvatar(false);
    };
    return (
        <div className={cx("wrapper", { fadeOut: isClosing })}>
            <div className={cx("container")}>
                <button
                    className={cx("btn_close")}
                    onClick={() => handleOnClose()}
                >
                    <TiDelete />
                </button>
                <div className={cx("center")}>
                    <div className={cx("title")}>
                        {`${addAvatar ? "Thêm" : "Chỉnh sửa"} ảnh đại diện`}
                    </div>
                    <button
                        className={cx("avatar")}
                        onClick={() => handleOnClickImage()}
                    >
                        <div>
                            <Image
                                src={avatar || images.noAvatar}
                                alt="avatar user"
                            />
                        </div>
                        <span>
                            <FaRegEdit />
                        </span>
                    </button>
                </div>
                <div className={cx("action")}>
                    <Button
                        primary
                        className={cx("btn_cancel")}
                        onClick={() => handleOnClose()}
                    >
                        Bỏ Qua
                    </Button>
                    <Button primary className={cx("btn_confirm")}>
                        Xác Nhận
                    </Button>
                </div>
            </div>
            {isAvatar && (
                <AvatarCropper imgSrc={avatar} onCropDone={handleOnCropImage} />
            )}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleInputImage(e)}
                className={cx("image")}
            />
        </div>
    );
}
AvatarCropper.propTypes = {
    addAvatar: PropTypes.bool,
};

export default EditAvatar;
