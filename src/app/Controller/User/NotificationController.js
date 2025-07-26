const Notification = require('../../Model/Notification');
const NotificationStatus = require('../../Model/NotificationStatus');

class NotificationController {
    //  [GET] --/user/notification
    async getNotifications(req, res, next) {
        try {
            const { user_ID } = req.user;
            const notificationUser = await NotificationStatus.find({
                user_ID,
            })
                .select('notification_ID is_read')
                .lean();
            // hashmap notification
            const notificationMap = {};
            notificationUser.forEach((item) => {
                notificationMap[item.notification_ID] = item.is_read;
            });
            const NotificationIDs = notificationUser.map(
                (item) => item.notification_ID,
            );
            //  lấy các thông báo gửi đến tất cả chưa có trong NotificationIDs
            const notificationsAll = await Notification.find({
                is_sendAll: true,
                _id: { $nin: NotificationIDs },
            })
                .select('-is_sendAll')
                .sort({ createdAt: -1 })
                .lean();
            // lấy tất cả thông báo
            const notifications = await Notification.find({
                _id: { $in: NotificationIDs },
            })
                .sort({ createdAt: -1 })
                .lean();
            // gán read cho notificationAll
            const notificationsAllWithRead = notificationsAll.map((noti) => ({
                ...noti,
                is_read: false,
            }));
            //  gán is read nó notifications
            const notificationsWithRead = notifications.map((noti) => ({
                ...noti,
                is_read: notificationMap[noti._id] || false,
            }));
            const finalResultSortNotification = [
                ...notificationsAllWithRead,
                ...notificationsWithRead,
            ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return res.status(200).json({ data: finalResultSortNotification });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    // [POST] --/user/notification/read
    async readNotification(req, res, next) {
        try {
            const { notifications } = req.body;
            const { user_ID } = req.body;
            if (!Array.isArray(notifications)) {
                return res
                    .status(400)
                    .json({ error: 'Missing required fields' });
            }
            const bulkOps = notifications.map((id) => ({
                updateOne: {
                    filter: { user_ID, notification_ID: id },
                    update: {
                        $set: { is_read: true, readAt: new Date() },
                    },
                    upsert: true,
                },
            }));
            await NotificationStatus.bulkWrite(bulkOps);
            return res
                .status(200)
                .json({ data: { message: 'read notifications successful!' } });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new NotificationController();
