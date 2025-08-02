import classNames from "classnames/bind";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { IoMdCloudDownload } from "react-icons/io";

import style from "./Product.module.scss";
import Image from "~/Components/Image";
import { formatNumberPrice } from "~/Util/lib/formatNumberPrice";
import { GrView } from "react-icons/gr";
import Button from "../Button";
import { formatDay } from "~/Util/lib/formatDate";

const cx = classNames.bind(style);

const defaultFunc = () => {};
function Product({
    item = {},
    className = "",
    is_action = false,
    is_Download = false,
    isDisable = false,
    handleOnMouseEnter = defaultFunc,
    handleOnMouseLeave = defaultFunc,
    handleOnClickDownload = defaultFunc,
}) {
    const classes = cx("wrapper", {
        [className]: className,
        is_action,
    });
    return (
        <Link
            to={!is_Download && `/product/${item.slug || "do-an-test"}`}
            className={classes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
        >
            <div className={cx("image")}>
                <Image src={item.image_url || ""} alt="product" />
            </div>
            <div className={cx("content", { is_Download })}>
                <h3>{item.title || "Đố Án Của SrcPlace"}</h3>
                {is_Download ? (
                    <>
                        <p>
                            Đã mua vào:{" "}
                            {formatDay(item.createdAt || new Date())}
                        </p>
                        <div className={cx("wrapper_btn")}>
                            <Button
                                primary
                                disable={
                                    (isDisable || item.isDownloaded) ?? true
                                }
                                onClick={() => handleOnClickDownload(item)}
                                leftIcon={<IoMdCloudDownload />}
                            >
                                {item.isDownloaded
                                    ? "Tải Xuống"
                                    : "Đã tải xuống"}
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p>
                            {formatNumberPrice({
                                number: item.price || 500000,
                            })}
                        </p>
                        <div className={cx("views")}>
                            <span>
                                <GrView />
                            </span>
                            <p>{item.sold || 0}</p>
                        </div>
                    </>
                )}
            </div>
        </Link>
    );
}

Product.propTypes = {
    // item: PropTypes.object.isRequired,
    className: PropTypes.string,
    is_action: PropTypes.bool,
    is_Download: PropTypes.bool,
    handleOnHover: PropTypes.func,
    handleOnMouseLeave: PropTypes.func,
};

export default Product;
