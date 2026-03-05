import classNames from "classnames/bind";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import style from "./Product.module.scss";
import Image from "~/Components/Image";
import { formatNumberPrice } from "~/Util/lib/formatNumberPrice";

const cx = classNames.bind(style);

function Product({ data = {} }) {
    return (
        <div className={cx("wrapper")}>
            <Link
                to={`/${data.slug || "do-an-test"}`}
                className={cx("product")}
            >
                <Image src={data.thumbnail || ""} alt="ảnh đồ án" />
                <div className={cx("title")}>
                    <h3>{data.title || "Đồ án test của SrcPlace  "}</h3>
                </div>
            </Link>
            <span className={cx("price")}>
                {formatNumberPrice({ number: data.price || 500000 })}
            </span>
        </div>
    );
}

export default Product;
