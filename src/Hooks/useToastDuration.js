import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect } from "react";

import { selectToasts } from "~/Features/Toast/toastSelect";
import { removeToast } from "~/Features/Toast/toastSlice";
function useToastDuration() {
    const dispatch = useDispatch();
    const toasts = useSelector(selectToasts);
    useEffect(() => {
        const timers = [];

        toasts.forEach((item) => {
            if (!item.title) return;

            toast[item.type](item.title, { autoClose: item.duration || 3000 });

            const timer = setTimeout(() => {
                dispatch(removeToast({ id: item.id }));
            }, item.duration || 3000);

            timers.push(timer);
        });

        return () => {
            timers.forEach((timer) => clearTimeout(timer));
        };
    }, [dispatch, toasts]);
}

export default useToastDuration;
