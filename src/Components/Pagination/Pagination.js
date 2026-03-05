import classNames from "classnames/bind";
import PropTypes from "prop-types";

import style from "./Pagination.module.scss";
import Button from "~/Components/Button";
import { useEffect, useState } from "react";

const cx = classNames.bind(style);

const defaultFunc = () => {};
function Pagination({
    page = 1,
    maxPage = 10,
    isDark = false,
    handleOnNextPage = defaultFunc,
}) {
    const [current, setCurrent] = useState(page);
    useEffect(() => {
        setCurrent(page);
    }, [page]);
    return (
        <div className={cx("wrapper", { isDark })}>
            <Button
                outline
                className={cx("btn_page", "btn_nextFull")}
                disable={current === 1}
                onClick={() => handleOnNextPage(1)}
            >
                First
            </Button>
            <div className={cx("current")}>
                {current > 1 && (
                    <Button
                        outline
                        className={cx("btn_page")}
                        onClick={() => handleOnNextPage(current - 1)}
                    >
                        {current - 1}
                    </Button>
                )}
                <Button outline className={cx("btn_page", "current")}>
                    {current}
                </Button>
                {current < maxPage && (
                    <Button
                        outline
                        className={cx("btn_page")}
                        onClick={() => handleOnNextPage(current + 1)}
                    >
                        {current + 1}
                    </Button>
                )}
            </div>
            <Button
                outline
                className={cx("btn_page", "btn_nextFull")}
                disable={current >= maxPage}
                onClick={() => handleOnNextPage(maxPage)}
            >
                Last
            </Button>
        </div>
    );
}

Pagination.propTypes = {
    page: PropTypes.number,
    maxPage: PropTypes.number,
    handleOnNextPage: PropTypes.func,
};
export default Pagination;
