import classNames from "classnames/bind";
import PropTypes from "prop-types";
import { GoDotFill } from "react-icons/go";

import style from "./Menu.module.scss";
import Image from "~/Components/Image";
import { formatNumberPrice } from "~/Util/lib/formatNumberPrice";
import Button from "~/Components/Button";

const cx = classNames.bind(style);

function MenuItem({ item, isImage = false, isPrice = false, onChange }) {
    console.log(item.to);
    let link = null;
    if (item.to) {
        link = item.to;
    } else if (item.slug) {
        link = `/product/${item.slug}`;
    }
    const imageSrc = item.thumbnail?.image_url || item.image_url || "";
    const title = item.name || item.title || "";
    const price = item.price;
    const icon = item.icon || "";

    return (
        <div className={cx("menuItem")}>
            <Button
                to={link ? link : undefined}
                leftIcon={icon}
                className={cx("item")}
                onClick={onChange ? () => onChange(item) : undefined}
                large
            >
                <div className={cx("item_wrapper")}>
                    {isImage && !imageSrc && (
                        <span className={cx("item_thumb")}>
                            <Image
                                src={imageSrc || ""}
                                alt="hình ảnh sản phẩm"
                            />
                        </span>
                    )}
                    <h3 className={cx("item_title")}>
                        {title || "đơn hàng thành công"}
                    </h3>
                    {isPrice && !price != null && (
                        <p className={cx("item_price")}>
                            {formatNumberPrice({ number: price || 300000 })}
                        </p>
                    )}
                </div>
            </Button>
            {item.is_read === false && (
                <span className={cx("dot")}>
                    <GoDotFill />
                </span>
            )}
        </div>
    );
}

MenuItem.propTypes = {
    isImage: PropTypes.bool,
    isPrice: PropTypes.bool,
    onChange: PropTypes.func,
    item: PropTypes.object, // .isRequired
};

export default MenuItem;
