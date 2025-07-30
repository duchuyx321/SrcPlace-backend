import classNames from "classnames/bind";
import { useDispatch, useSelector } from "react-redux";

import style from "./UserActions.module.scss";

import Notify from "./Notify";
import Shopping from "./Shopping";
import MeService from "~/Services/MeService";
import { updateToastProduct } from "~/Features/Cart/cartSlice";
import { selectIsFetchedCart } from "~/Features/Cart/cartSelect";
import { selectIsFetchedNotification } from "~/Features/Notification/notificationSelect";
import { updateNotificationUnread } from "~/Features/Notification/notificationSlice";
import { useFetch } from "~/Hooks";

const cx = classNames.bind(style);

function UserActions() {
    const dispatch = useDispatch();
    const isFetchedCart = useSelector(selectIsFetchedCart);
    const isFetchedNotification = useSelector(selectIsFetchedNotification); // chưa làm notify lấy tạm
    const handleFetchApiSummery = async () => {
        const result = await MeService.getSummary();
        if (!result.error) {
            dispatch(updateToastProduct({ totalProduct: result.countCard }));
            dispatch(
                updateNotificationUnread({
                    notificationsUnread: result.notificationCount,
                })
            );
        }
    };
    useFetch({
        handleOnInside: handleFetchApiSummery,
        isFetchedList: [isFetchedCart, isFetchedNotification],
    });
    return (
        <div className={cx("wrapper")}>
            <Notify />
            <Shopping />
        </div>
    );
}

export default UserActions;
