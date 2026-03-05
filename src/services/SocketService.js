class SocketService {
    constructor() {
        this.userOnline = new Map();
    }
    async addUserOnline(user_ID, socket_ID) {
        this.userOnline.set(user_ID, socket_ID);
    }
    async deleteUserOnline(user_ID) {
        this.userOnline.delete(user_ID);
    }
    // gửi dữ liệu đến 1 người
    async emitToUser(io, user_ID = '', event = '', data) {
        const is_online = this.userOnline.has(user_ID);
        if (is_online) {
            await io.to(user_ID).emit(event, data);
        }
        return 'send message successful';
    }
    // gửi đến nhiều người
    async emitToUsers(io, user_Ids = [], event = '', data) {
        user_Ids.forEach(async (user_ID) => {
            await this.emitToUser(io, user_ID, event, data);
        });
        return 'send message successful';
    }
    // gửi đến tất cả người dùng đagn online
    async emitToAll(io, event, data) {
        await io.emit(event, data);
    }
}
module.exports = new SocketService();
