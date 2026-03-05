const Notification = require('../app/Model/Notification');
const NotificationStatus = require('../app/Model/NotificationStatus');

class NotificationService {
    // add notify
    async addNotify({
        notifiable_type = '',
        user_IDs = [],
        title = '',
        message = '',
        notifiable_link = '',
        notifiable_meta = '',
        is_sendAll = false,
    } = {}) {
        try {
            const notify = new Notification({
                title,
                message,
                notifiable_link,
                notifiable_meta,
                notifiable_type,
            });
            await notify.save();
            if (!is_sendAll && user_IDs.length > 0) {
                const saves = user_IDs.map((user_ID) => {
                    const notificationStatus = new NotificationStatus({
                        user_ID,
                        notification_ID: notify._id,
                    });
                    return notificationStatus.save();
                });
                await Promise.all(saves);
            }
            return {
                status: 200,
                message: 'add notification successful',
            };
        } catch (error) {
            console.log(error.message);
            return {
                status: 501,
                error: error.message,
            };
        }
    }
}
module.exports = new NotificationService();
