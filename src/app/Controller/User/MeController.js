const Orders = require('../../Model/Orders');
const Card = require('../../Model/Card');
const Users = require('../../Model/Users');
const Projects = require('../../Model/Projects');
const Wallet = require('../../Model/Wallet');
const Notification = require('../../Model/Notification');
const NotificationStatus = require('../../Model/NotificationStatus');

const CloudinaryService = require('../../../services/CloudinaryService');
const MailerServices = require('../../../services/MailerServices');
const VerifyCodesServices = require('../../../services/VerifyCodesServices');
const { comparePassword, hashPassword } = require('../../../util/passwordUtil');
const { validateField } = require('../../../util/checkValid');

class UserController {
    // [GET] --/user/me
    async getMyProfile(req, res, next) {
        try {
            const { user_ID } = req.user;
            const [user, wallet] = await Promise.all([
                Users.findOne({ _id: user_ID }),
                Wallet.findOne({ user_ID }),
            ]);
            if (!user || !wallet) {
                return res.status(503).json({ error: 'User does not exist!' });
            }
            const { password, ...otherUser } = user._doc;
            // lấy khá học đã mua
            const orders = await Orders.find({ user_ID })
                .select('project_ID ')
                .sort({ createdAt: -1 })
                .limit(4);
            const projectIds = orders.map((order) => order.project_ID);
            const projects = projectIds.length
                ? await Projects.find({ _id: { $in: projectIds } })
                : [];
            return res.status(200).json({
                data: {
                    ...otherUser,
                    orderProjects: projects,
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [GET] --/user/me/summary
    async summary(req, res, next) {
        try {
            const { user_ID } = req.user;
            const notifications = await Notification.find({
                is_sendAll: true,
            }).select('_id');
            const notification_IDs = notifications.map((item) => item._id);
            // Đếm song song
            const [countNotifyAll, countNotifyNoRead, countCard] =
                await Promise.all([
                    NotificationStatus.countDocuments({
                        notification_ID: { $in: notification_IDs },
                        is_read: false,
                    }),
                    NotificationStatus.countDocuments({
                        user_ID,
                        is_read: false,
                    }),
                    Card.countDocuments({
                        user_ID,
                    }),
                ]);

            // Tổng số thông báo chưa đọc (gửi all + gửi riêng)
            const notificationCount =
                notification_IDs.length - countNotifyAll + countNotifyNoRead;
            return res.status(200).json({
                data: {
                    notificationCount,
                    countCard,
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [POST] --/user/me/send-mail
    async sendCodeToMail(req, res, next) {
        try {
            const { user_ID, device_ID } = req.user;

            const user = await Users.findOne({ _id: user_ID });
            if (!user) {
                return res.status(503).json({ error: 'Users do not exist!' });
            }
            const to = [user.email];
            const code = await newCode();
            const template = MailTemplates['SEND_OTP'];
            const subject = template.subject;
            const text =
                typeof template.text === 'function'
                    ? template.text({ code })
                    : template.text;
            // gửi đến người dùng
            await MailerServices.sendMailerAndNotify({
                to,
                subject,
                text,
                first_name: user.first_name,
                last_name: user.last_name,
                is_notify: false, // không phải là thông báo
            });
            //  lưu code vào db
            await VerifyCodesServices.AddVerifyCodes({
                user_ID,
                device_ID,
                code,
            });
            return res.status(200).json({
                data: {
                    message: 'Send Code To Email successful!',
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [POST] --/user/me/verifyCode
    async verifyCode(req, res, next) {
        try {
            return res.status(200).json({ data: 'code successful' });
        } catch (error) {
            console.log(error.message);
            return res.status(501).json({ error: error.message });
        }
    }
    // [PATCH] --/user/me
    async updateMyProfile(req, nes, next) {
        try {
            let { ...updates } = req.body;
            const { user_ID } = req.user;
            if (!updates) {
                return res.status(403).json({ error: 'no data to upload!' });
            }
            const result = await Users.updateOne(
                { _id: user_ID },
                { $set: updates },
            );
            if (result.modifiedCount === 0) {
                return res.status(200).json({ message: 'No changes made.' });
            }
            return res
                .status(200)
                .json({ message: 'Profile updated successfully.' });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [PATCH] --/user/me/password
    async changePassword(req, res, next) {
        try {
            const { newPass, pass, repeatPass } = req.body;
            const { user_ID } = req.user;
            const user = await Users.findOne({ _id: user_ID });
            await validateField({
                type: 'password',
                valid: pass,
                min: 8,
                max: 20,
            });
            if (newPass !== repeatPass)
                return res.status(400).json({ error: 'Invalid password!' });
            if (!user)
                return res.status(404).json({ error: 'User does not exist!' });
            const is_password = await comparePassword(pass, user.password);
            if (!is_password)
                return res.status(403).json({ error: 'Incorrect password' });
            // thay đổi mật khẩu
            const hashPass = await hashPassword(newPass);
            const changePass = await Users.updateOne(
                { _id: user_ID },
                { $set: { password: hashPass } },
            );
            if (changePass.modifiedCount === 0) {
                return res.status(200).json({ message: 'No changes made.' });
            }
            return res
                .status(200)
                .json({ message: 'change password successfully.' });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    async updateAvatar(res, req, next) {
        const file = req.file;
        try {
            const { user_ID } = req.user;
            const avatarUser = await Users.findById(user_ID).select('avatar');
            if (!avatarUser) {
                if (file) {
                    await CloudinaryService.deleteCloudinaryFile(file.filename);
                }
                return res.status(404).json({ error: 'User does not exist!' });
            }
            if (avatarUser.avatar?.public_id) {
                await CloudinaryService.deleteCloudinaryFile(
                    avatarUser.avatar?.public_id,
                );
            }
            const updateAvatarCurrent = await Users.updateOne(
                { _id: user_ID },
                {
                    $set: {
                        avatar: {
                            image_url: file?.path || '',
                            public_id: file?.filename || '',
                        },
                    },
                },
            );
            if (updateAvatarCurrent.modifiedCount === 0) {
                if (file) {
                    await CloudinaryService.deleteCloudinaryFile(file.filename);
                }
                return res
                    .status(200)
                    .json({ message: 'update avatar is false!' });
            }
            return res
                .status(200)
                .json({ message: 'avatar updated successfully.' });
        } catch (error) {
            if (file) {
                await CloudinaryService.deleteCloudinaryFile(file.filename);
            }
            return res.status(501).json({ error: error.message });
        }
    }
}
module.exports = new UserController();
