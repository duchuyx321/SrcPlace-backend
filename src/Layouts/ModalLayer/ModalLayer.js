import { useSelector } from "react-redux";

import { selectIsShowAuthModal } from "~/Features/AuthModal/authModalSelect";
import { selectIsShowAvatarModal } from "~/Features/AvatarModal/AvatarModalSelect";
import {
    selectIsVerifying,
    selectResultVerify,
} from "~/Features/Verify/VerifySelect";
import { selectIsShowModal } from "~/Features/Modal/modalSelect";
import Auth from "~/Components/Auth";
import Modal from "~/Components/Modal";
import EditAvatar from "~/Components/EditAvatar";
import Authenticate from "~/Components/Authenticate";

function ModalLayer() {
    const resultVerify = useSelector(selectResultVerify);
    const isShowAuthModal = useSelector(selectIsShowAuthModal);
    const isShowAvatarModal = useSelector(selectIsShowAvatarModal);
    const isVerifying = useSelector(selectIsVerifying);
    const isShowModal = useSelector(selectIsShowModal);
    return (
        <>
            {/* login and register */}
            {isShowAuthModal && <Auth />}
            {/* Avatar */}
            {isShowAvatarModal && <EditAvatar />}
            {/* Authenticate */}
            {isVerifying && (
                <Authenticate
                    title={resultVerify.title}
                    description={resultVerify.description}
                    isShowListMethod={resultVerify.isShowListMethod}
                    email={resultVerify.email}
                    isCloseModal={resultVerify.isClose}
                />
            )}
            {/* modal */}
            {isShowModal && <Modal />}
        </>
    );
}

export default ModalLayer;
