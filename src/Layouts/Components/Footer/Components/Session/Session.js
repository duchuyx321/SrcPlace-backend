import classNames from "classnames/bind";
import PropTypes from "prop-types";

import style from "./Session.module.scss";
import Button from "~/Components/Button";
import Image from "~/Components/Image";
import { Link } from "react-router-dom";

const cx = classNames.bind(style);
function Session({ title = "", description = "", items = [] }) {
    return (
        <div className={cx("wrapper")}>
            <h3>{title}</h3>
            {description && <p>{description}</p>}
            <div className={cx("content")}>
                {items.map((item, index) =>
                    item.src ? (
                        <Link
                            key={index}
                            to={item.to}
                            className={cx("item_image")}
                        >
                            <span className="image">
                                <Image
                                    src={item.src || undefined}
                                    alt={item.alt}
                                />
                            </span>
                            <h3>{item.title}</h3>
                        </Link>
                    ) : (
                        <Button
                            key={index}
                            href={item.href}
                            to={item.to}
                            text
                            small
                            className={cx("item")}
                            leftIcon={item.leftIcon}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {item.title}
                        </Button>
                    )
                )}
            </div>
        </div>
    );
}

Session.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    items: PropTypes.array,
};

export default Session;
