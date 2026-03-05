require('dotenv').config();

module.exports = {
    MAILER: {
        USER: process.env.ADDRESS_MAIL,
        PASS: process.env.PASSWORD_MAIL,
    },
};
