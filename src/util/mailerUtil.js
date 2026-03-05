const nodemailer = require('nodemailer');
const configMailer = require('../config/Mail/ConnectMailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.ADDRESS_MAIL,
        pass: process.env.PASSWORD_MAIL,
    },
});
const message = async (to, subject, text, html) => {
    return {
        from: `"SrcPlace Support" <${configMailer.MAILER.USER}>`,
        to,
        subject,
        text,
        html,
    };
};
// mình có thể bỏ qua việc chớ nó gửi xong mới bắt đầu hoạt đọng tiếp
const emailSender = async ({
    to = [],
    subject = '',
    text = '',
    html = '',
} = {}) => {
    const mess = await message(to, subject, text, html);
    const info = await transporter.sendMail(mess);
    return info;
};

module.exports = { emailSender };
