import { createSlice } from "@reduxjs/toolkit";

const init = {
    notificationsUnread: 0,
    result: [],
    isFetched: false,
};

const notificationSlice = createSlice({
    name: "notification",
    initialState: init,
    reducers: {
        getDataToNotification(state, action) {
            state.isFetched = true;
            state.result = action.payload.notifications;
        },
        addNotification(state, action) {
            state.result.unshift(action.payload.notification);
        },
        readNotification(state, action) {
            const id = action.payload.id;
            const index = state.result.findIndex((item) => item._id === id);

            if (index !== -1 && !state.result[index].is_read) {
                state.result[index].is_read = true;
                state.notificationsUnread = Math.max(
                    0,
                    state.notificationsUnread - 1
                );
            }
        },
        updateNotificationUnread(state, action) {
            state.notificationsUnread = action.payload.notificationsUnread || 0;
        },
        // clear All
        clearNotification(state) {
            state.notificationsUnread = init.notificationsUnread;
            state.result = init.result;
            state.isFetched = init;
        },
    },
});
export const {
    addNotification,
    clearNotification,
    getDataToNotification,
    updateNotificationUnread,
    readNotification,
} = notificationSlice.actions;
export default notificationSlice.reducer;
