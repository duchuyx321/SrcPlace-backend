const MailTemplates = require('../config/Mail/MailTemplates');
const { emailSender } = require('../util/mailerUtil');
const NotificationService = require('./NotificationService');
const SocketService = require('./SocketService');

class MailerServices {
    async sendMailerAndNotify({
        type = '',
        to = [],
        user_IDs = [],
        subject = '',
        text = '',
        first_name = '',
        last_name = '',
        is_notify = true,
        is_sendAll = false,
    } = {}) {
        if (to.length < 1) {
            return {
                status: 400,
                error: 'Missing recipient email address',
            };
        }
        const html = this.designHtmlMailer({ first_name, last_name, text });
        const info = await emailSender({ to, html, subject, text });
        // lưu thông báo vào db
        if (is_notify) {
            await NotificationService.addNotify({
                title: subject,
                message: text,
                user_IDs,
                notifiable_type: type,
                is_sendAll,
            });
        }
        return {
            status: 200,
            message: 'Send and Notify mail successful',
            info,
        };
    }

    designHtmlMailer({ first_name = '', last_name = '', text = '' } = {}) {
        const html = `
            <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f5f5f5;">
                <div style="width:100%; padding: 20px 0; display:flex; justify-content:center; background-color:#f5f5f5;">
                    <div style="width:600px; background-color:#ffffff; border:1px dashed #333; border-radius:8px; overflow:hidden;">

                        <!-- Header -->
                        <div style="background: #b8e6fb; padding:16px; display:flex; align-items:center;">
                            <img src="https://res.cloudinary.com/dxkcm49hy/image/upload/v1750135004/srcPlace_logo_gray_dhwxmr.jpg"
                                alt="SrcPlace Logo" style="height:60px; margin-right:16px;" />
                            <h3 style="font-size:24px; color:#333; margin:0;">SrcPlace - Nơi cung cấp đồ án chất lượng</h3>
                        </div>

                        <!-- Body -->
                        <div style="padding:24px; border-top:1px dashed #333; border-bottom:1px dashed #333;">
                            <p style="font-size:16px; margin-bottom:20px;"><strong>${first_name + ' ' + last_name}</strong> - thân mến,</p>
                            <p style="font-size:16px; margin-bottom:20px;">
                                ${text}
                            </p>
                            <p style="font-size:16px;">Trân trọng,<br /> <strong>Supporter SrcPlace</strong></p>
                        </div>

                        <!-- Footer -->
                        <div style="text-align:center;">
                            <img src="https://res.cloudinary.com/dxkcm49hy/image/upload/v1750138158/thumb_gmail_ak5zx7.png"
                                alt="Footer Image" style="width:100%; display:block;" />
                        </div>
                    </div>
                </div>
            </body>
            `;
        return html;
    }
}

module.exports = new MailerServices();
