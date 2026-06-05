export const selectIsFetchedNotification = (state) =>
    state.notification.isFetched;

export const selectResultNotification = (state) => state.notification.result;

export const selectNotificationsUnread = (state) =>
    state.notification.notificationsUnread;
