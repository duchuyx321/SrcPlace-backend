const SocketService = require('../../services/SocketService');
const connectSocket = (io) => {
    io.on('connection', (socket) => {
        const user_ID = socket.handshake.query.user_ID;
        if (!user_ID) {
            console.log('Missing user_ID');
            socket.disconnect();
            return;
        }
        console.log(`User ${user_ID} connect socket is:${socket.id}`);
        SocketService.addUserOnline(user_ID, socket.id);
        // gắn user_ID vào socket để dùng sau
        socket.user_ID = user_ID;
        socket.join(user_ID);

        socket.on('disconnect', () => {
            console.log(`User ${user_ID} disconnect`);
            SocketService.deleteUserOnline(user_ID);
        });
    });
};

module.exports = connectSocket;
