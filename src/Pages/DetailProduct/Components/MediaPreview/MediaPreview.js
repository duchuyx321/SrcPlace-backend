import classNames from "classnames/bind";
import PropTypes from "prop-types";
import { useState } from "react";
import { BsFillPlayFill } from "react-icons/bs";

import style from "./MediaPreview.module.scss";
import Image from "~/Components/Image";

const cx = classNames.bind(style);

function MediaPreview({ items = [] }) {
    const [current, setCurrent] = useState(items[1]);
    return (
        <div className={cx("wrapper")}>
            {current.type === "video" ? (
                <iframe
                    src={`https://www.youtube.com/embed/${current.url}`}
                    title="Demo sản phẩm"
                    allow="accelerometer; autoplay;
                                clipboard-write; encrypted-media; gyroscope;
                                picture-in-picture"
                    allowFullScreen
                ></iframe>
            ) : (
                <Image src={current.url} alt="Demo Sản Phẩm" />
            )}
            <div className={cx("arise")}>
                {items.map((item, index) => {
                    const isActive =
                        item.url === current.url && item.type === current.type;
                    return (
                        <button
                            key={index}
                            className={cx("btn_arise", { active: isActive })}
                            onClick={() => setCurrent(item)}
                        >
                            <Image
                                src={
                                    item.type === "video"
                                        ? `https://img.youtube.com/vi/${item.url}/hqdefault.jpg`
                                        : item.url
                                }
                                alt="Demo Sản Phẩm"
                            />
                            {item.type === "video" && (
                                <span className={cx("iconVideo")}>
                                    <BsFillPlayFill />
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
MediaPreview.propTypes = {
    items: PropTypes.array,
};
export default MediaPreview;
