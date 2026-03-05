import * as httpsRequest from "~/Util/httpsRequest";
class NotificationService {
    // get data notification
    async getDataNotification() {
        try {
            const result = await httpsRequest.GET("user/notification");
            return result.data;
        } catch (error) {
            console.log(error);
        }
    }
    //  read notification
    async readNotification(notifications) {
        try {
            await httpsRequest.POST("user/notification/read", {
                notifications,
            });
        } catch (error) {
            console.log(error);
        }
    }
}
export default new NotificationService();
