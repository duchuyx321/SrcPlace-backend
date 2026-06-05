import classNames from "classnames/bind";
import PropTypes from "prop-types";
import Cropper from "react-easy-crop";
import { useCallback, useState } from "react";

import style from "./AvatarCropper.module.scss";
import getCroppedImg from "./getCroppedImg";
import Button from "~/Components/Button";

const cx = classNames.bind(style);

function AvatarCropper({ imgSrc, onCropDone }) {
    const [isClosing, setIsClosing] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);
    const handleOnSubmit = async () => {
        try {
            const { blob, fileUrl } = await getCroppedImg(
                imgSrc,
                croppedAreaPixels
            );
            console.log({ blob, fileUrl });
            setIsClosing(true);
            setTimeout(() => {
                onCropDone(fileUrl);
            }, 300);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className={cx("wrapper", { fadeOut: isClosing })}>
            <div className={cx("cropImage")}>
                <Cropper
                    image={imgSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>
            <div className={cx("pullBar")}>
                <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                />
            </div>
            <Button
                className={cx("btn_crop")}
                onClick={() => handleOnSubmit()}
                primary
            >
                Đồng ý
            </Button>
        </div>
    );
}

AvatarCropper.propTypes = {
    imgSrc: PropTypes.string,
    onCropDone: PropTypes.func,
};

export default AvatarCropper;
