import { useSelector } from "react-redux";

import { selectIsShowAuthModal } from "~/Features/AuthModal/authModalSelect";
import { selectIsShowAvatarModal } from "~/Features/AvatarModal/AvatarModalSelect";
import {
    selectIsVerifying,
    selectResultVerify,
} from "~/Features/Verify/VerifySelect";
import Auth from "~/Components/Auth";
import EditAvatar from "~/Components/EditAvatar";
import Authenticate from "~/Components/Authenticate";

function ModalLayer() {
    const isShowAuthModal = useSelector(selectIsShowAuthModal);
    const isShowAvatarModal = useSelector(selectIsShowAvatarModal);
    const isVerifying = useSelector(selectIsVerifying);
    const resultVerify = useSelector(selectResultVerify);

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
        </>
    );
}

export default ModalLayer;
