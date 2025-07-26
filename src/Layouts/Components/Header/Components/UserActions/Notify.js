import classNames from "classnames/bind";
import { FaBell } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import style from "./UserActions.module.scss";
import Menu from "~/Components/Wrapper/Menu";
import {
    selectIsFetchedNotification,
    selectResultNotification,
    selectNotificationsUnread,
} from "~/Features/Notification/notificationSelect";
import {
    getDataToNotification,
    readNotification,
} from "~/Features/Notification/notificationSlice";
import { useDebounce, useFetch } from "~/Hooks";
import NotificationService from "~/Services/NotificationService";

const cx = classNames.bind(style);
function Notify() {
    const [isHidden, setIsHidden] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const debounce = useDebounce(notifications, 600);
    const resultNotification = useSelector(selectResultNotification);
    const notificationsUnread = useSelector(selectNotificationsUnread);
    const dispatch = useDispatch();
    const isFetchedNotification = useSelector(selectIsFetchedNotification);
    const handleOnFetchApiNotification = async () => {
        const resultDataNotification =
            await NotificationService.getDataNotification();
        dispatch(
            getDataToNotification({
                notifications: resultDataNotification,
            })
        );
    };
    useFetch({
        handleOnInside: handleOnFetchApiNotification,
        isFetchedList: [isFetchedNotification],
    });
    const handleOnChangeItem = (item) => {
        setNotifications((prev) => [...prev, item._id]);
        dispatch(readNotification({ id: item._id }));
    };
    const handleHidden = () => {
        setIsHidden(!isHidden);
    };
    const handleFetchApiRead = async (notifications) => {
        await NotificationService.readNotification(notifications);
    };
    useEffect(() => {
        if (debounce?.length === 0) return;
        // call api để đọc
        handleFetchApiRead(debounce);
    }, [debounce]);
    return (
        <Menu
            hideOnClick={isHidden}
            small
            title="Thông Báo"
            items={resultNotification}
            onChange={handleOnChangeItem}
            onClickHide={setIsHidden}
        >
            <button
                onClick={() => handleHidden()}
                className={cx("wrapper_event", { isHidden })}
            >
                {notificationsUnread !== 0 && (
                    <div className={cx("count")}>{notificationsUnread}</div>
                )}
                <span className={cx("icon")}>
                    <FaBell />
                </span>
            </button>
        </Menu>
    );
}

export default Notify;
