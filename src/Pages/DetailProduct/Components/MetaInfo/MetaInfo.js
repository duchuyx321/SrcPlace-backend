import classNames from "classnames/bind";
import PropTypes from "prop-types";
import { BsFillCalendarPlusFill } from "react-icons/bs";

import style from "./MetaInfo.module.scss";
import { formatDay } from "~/Util/lib/formatDate";

const cx = classNames.bind(style);

function MetaInfo({ date = new Date() }) {
    const MetaInfos = [
        {
            icon: <BsFillCalendarPlusFill />,
            title: formatDay(date),
        },
        {
            icon: <BsFillCalendarPlusFill />,
            title: formatDay(date),
        },
    ];
    return (
        <ul className={cx("wrapper")}>
            {MetaInfos.map((item, index) => (
                <li key={index} className={cx("metaItem")}>
                    <span>{item.icon}</span>
                    <p>{item.title}</p>
                </li>
            ))}
        </ul>
    );
}

export default MetaInfo;
