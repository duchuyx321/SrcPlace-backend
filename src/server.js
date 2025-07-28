const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

require('dotenv').config();
require('./config/Passport/connectPassport');

const router = require('./routes');
const connectMongoDB = require('./config/Database/ConnectMongoDB');
const ConnectSocket = require('./config/Socket/ConnectSocket');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT;

// connect db
connectMongoDB();
// bắt dữ liệu
app.use(morgan('combined'));
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.URL_CLIENT,
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//file tĩnh
app.use(express.static(path.join(__dirname, 'Assets')));
// setup socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.URL_CLIENT,
        credentials: true,
    },
});
ConnectSocket(io);
app.use((req, res, next) => {
    req.io = io;
    next();
});
// router
router(app);
// set up proxy
app.set('trust proxy', true);

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
