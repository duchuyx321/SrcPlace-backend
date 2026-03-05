const mongoose = require('mongoose');
require('dotenv').config();

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECT_DATABASE_MONGODB);
        return console.log('Connect Database On MongoDB Is Successful');
    } catch (error) {
        console.log(error);
        return console.log('Connect Database On MongoDB Is Failed');
    }
};

module.exports = connectMongoDB;
