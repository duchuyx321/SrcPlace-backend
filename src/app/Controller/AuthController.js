// model
const Wallet = require('../Model/Wallet');
const Users = require('../Model/Users');
const TrustedDevices = require('../Model/TrustedDevices');
// util

const { hashPassword, comparePassword } = require('../../util/passwordUtil');
const { newDeviceID } = require('../../util/deviceUtil');
const {
    newAccessToken,
    newRefreshToken,
    newTempToken,
    setTokenInCookie,
} = require('../../util/jwtUtil');
const { validateField } = require('../../util/checkValid');
// services
const AuthServices = require('../../services/AuthServices');
const TokenService = require('../../services/TokenService');
const MailerServices = require('../../services/MailerServices');
const { newCode } = require('../../util/codeUtil');
const MailTemplates = require('../../config/Mail/MailTemplates');
const VerifyCodesServices = require('../../services/VerifyCodesServices');
const TowFactorAuthService = require('../../services/TwoFactorAuthService');
const CloudinaryService = require('../../services/CloudinaryService');
class AuthController {
    // [POST] --/auth/login
    async login(req, res, next) {
        try {
            const pass = req.body.password;
            const usernameOrEmail = req.body.usernameOrEmail;
            // kiểm tra tài khoản người dùng
            const user = await Users.findOne({
                $or: [
                    {
                        username: usernameOrEmail,
                    },
                    { email: usernameOrEmail },
                ],
            });
            if (!user) {
                return res
                    .status(401)
                    .json({ error: 'wrong username or email!' });
            }
            if (user.is_blocked) {
                return res.status(503).json({ error: 'user is blocked' });
            }
            const is_password = await comparePassword(pass, user.password);
            if (!is_password) {
                return res.status(401).json({ error: 'wrong password!' });
            }
            // check 2fa
            const userAgent = req.headers['user-agent'];
            const ip = req.ip;
            const trustedDevice = await TrustedDevices.findOne({
                user_ID: user._id,
                ip: ip,
                userAgent: userAgent,
            });
            let device_ID = trustedDevice?.device_ID;
            if (!trustedDevice) {
                device_ID = await newDeviceID();
            }
            const result = await AuthServices.validateLoginSession({
                user_ID: user._id,
                device_ID: device_ID,
                ip,
                userAgent,
            });
            const profile = {
                user_ID: user._id,
                device_ID,
                role: user.role,
            };
            const { is_session, is_enabled2fa, is_trustDevices, is_verify2fa } =
                result;
            let meta = {
                is_session,
                is_enabled2fa,
                is_trustDevices,
                is_verify2fa,
            };
            // kiểm tra và lấy token theo đúng yêu cầu
            if (!is_session && is_trustDevices) {
                const AccessToken = await newAccessToken(profile);
                const RefreshToken = await newRefreshToken({ profile });
                await res.cookie(
                    'refreshToken',
                    RefreshToken,
                    setTokenInCookie(),
                );
                // thêm cookie vào db
                await TokenService.addToken({
                    ip,
                    device_ID,
                    userAgent,
                    user_ID: user._id,
                    token: RefreshToken?.split(' ')[1],
                });
                meta = { ...meta, AccessToken };
                const { password, ...other } = user._doc;
                return res.status(200).json({ data: other, meta });
            } else {
                const TempToken = await newTempToken(profile);
                meta = { ...meta, TempToken };
                const user_IDs = [user._id];
                const to = [user.email];
                if (!is_trustDevices) {
                    // thêm thông báo và gửi đến người dùng
                    const type = 'LOGIN_WARING';
                    const template = MailTemplates[type];
                    const subject = template.subject;
                    const text =
                        typeof template.text === 'function'
                            ? template.text(userAgent)
                            : template.text;
                    const resultSendMail =
                        await MailerServices.sendMailerAndNotify({
                            to,
                            notifiable_type: type,
                            user_IDs,
                            subject,
                            text,
                            first_name: user.first_name,
                            last_name: user.last_name,
                        });
                    if (resultSendMail.status !== 200) {
                        return res
                            .status(resultSendMail.status)
                            .json({ error: resultSendMail.error });
                    }
                }
            }

            return res.status(200).json({ data: { meta } });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }
    // [POST] --/auth/register
    async register(req, res, next) {
        try {
            const { username, email, first_name, last_name } = req.body;
            const pass = req.body.password;
            console.log(req.body);
            if (!username || !pass || !email || !first_name || !last_name) {
                return res.status(401).json({ error: 'missing data upload!' });
            }
            // kiểm tra các thông tin gửi lên
            await validateField({
                type: 'username',
                valid: username,
                min: 6,
                max: 15,
            });
            await validateField({
                type: 'password',
                valid: pass,
                min: 8,
                max: 20,
            });
            await validateField({
                type: 'email',
                valid: email,
                min: 10,
                max: 38,
            });
            await validateField({
                type: 'first name',
                valid: first_name,
                min: 1,
                max: 30,
            });
            await validateField({
                type: 'last name',
                valid: last_name,
                min: 1,
                max: 30,
            });
            //  kiểm tra user or email đã tồn tại hay chưa
            const isUsername = await Users.findOne({ username });
            if (isUsername) {
                return res
                    .status(400)
                    .json({ error: 'Username already exists.' });
            }
            const isEmail = await Users.findOne({ email });
            if (isEmail) {
                return res.status(400).json({ error: 'Email already exists.' });
            }
            // hash pass
            const hashPass = await hashPassword(pass);
            // thêm vào db
            const newUser = new Users({
                username,
                email,
                password: hashPass,
                first_name,
                last_name,
            });
            await newUser.save();
            // gửi thông báo đến người dùng
            const type = 'WELCOME';
            const template = MailTemplates[type];
            const subject = template.subject;
            const text = template.text;
            const resultSendMail = await MailerServices.sendMailerAndNotify({
                to: [newUser.email],
                notifiable_type: type,
                user_IDs: [newUser._id],
                subject,
                text,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
            });
            if (resultSendMail.status !== 200) {
                return res
                    .status(resultSendMail.status)
                    .json({ error: resultSendMail.error });
            }
            // Khởi tạo wallet cho người dùng
            const wallet = new Wallet({ user_ID: newUser._id });
            await wallet.save();
            // lấy token
            const device_ID = await newDeviceID();
            const profile = {
                user_ID: newUser._id,
                device_ID,
                role: newUser.role,
            };
            const ip = req.ip;
            const userAgent = req.headers['user-agent'];
            // lưu địa chỉ an toàn
            await AuthServices.addTrustedDevice({
                user_ID: newUser._id,
                device_ID,
                ip,
                userAgent,
            });
            const TempToken = await newTempToken(profile);
            // trả về dữ liệu
            return res.status(200).json({ data: { meta: { TempToken } } });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    // [POST] --/auth/refresh
    async refresh(req, res, next) {
        try {
            // lưu ý cần kiểm tra token và thiết bị
            const { expiresAt, ...profile } = req.user;
            const AccessToken = await newAccessToken(profile);
            const expUnix = Math.floor(new Date(expiresAt).getTime() / 1000);
            const RefreshToken = await newRefreshToken({
                profile,
                exp: expUnix,
            });
            await res.cookie('refreshToken', RefreshToken, setTokenInCookie());
            const ip = req.ip;
            const userAgent = req.headers['user-agent'];
            // thêm cookie vào db
            await TokenService.addToken({
                ip,
                device_ID: profile.device_ID,
                userAgent,
                user_ID: profile.user_ID,
                token: RefreshToken?.split(' ')[1],
                expiresAt,
            });
            return res.status(200).json({ data: { meta: { AccessToken } } });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }
    // [POST] --/auth/logout
    async logout(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (refreshToken) {
                res.clearCookie('refreshToken', {
                    httpOnly: true,
                    sameSite: 'Strict',
                    secure: true,
                });
            }
            return res.status(200).json({ message: 'Logout successful!' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }
    // [POST] --/auth/pre-login-check
    async PrevLoginCheck(req, res, next) {
        try {
            const { user_ID, device_ID, role } = req.user;
            const { type, code, action } = req.body; // type: App || email', action: register || login
            if (type === 'email') {
                const checkVerifyCodes =
                    await VerifyCodesServices.CheckVerifyCodes({
                        user_ID,
                        device_ID,
                        code,
                    });
                if (checkVerifyCodes.status !== 200) {
                    return res
                        .status(checkVerifyCodes.status)
                        .json({ error: checkVerifyCodes.message });
                }
                if (action === 'register') {
                    const verifyUser = await Users.updateOne(
                        { _id: user_ID },
                        { $set: { is_verified: true } },
                    );
                    if (verifyUser.modifiedCount === 0) {
                        return res.status(501).json({ error: error.message });
                    }
                }
            } else {
                // check auth
                const checkTokenTwoFA =
                    await TowFactorAuthService.checkTowFactorAuth({
                        user_ID,
                        token,
                    });
                if (checkTokenTwoFA.status !== 200) {
                    return res
                        .status(checkTokenTwoFA.status)
                        .json({ error: checkTokenTwoFA.message });
                }
            }
            // tạo jwt
            const profile = { user_ID, device_ID, role };
            const AccessToken = await newAccessToken(profile);
            const RefreshToken = await newRefreshToken({ profile });
            await res.cookie('refreshToken', RefreshToken, setTokenInCookie());
            const ip = req.ip;
            const userAgent = req.headers['user-agent'];
            // thêm cookie vào db
            await TokenService.addToken({
                ip,
                device_ID,
                userAgent,
                user_ID,
                token: RefreshToken?.split(' ')[1],
            });
            const user = await Users.findById(user_ID).select('-password');
            const { password, ...other } = user._doc;
            return res.status(200).json({ data: other, meta: { AccessToken } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [POST] --/auth/send-mail
    async sendCodeTOMail(req, res, next) {
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
    // [POST] --/auth/session/resume
    async resumeSession(req, res, next) {
        try {
            const { user_ID, device_ID, role } = req.user;
            const user = await Users.findOne({
                _id: user_ID,
                is_blocked: false,
            }).select('-password');
            if (!user) {
                return res
                    .status(404)
                    .json({ error: 'User not found or is blocked!' });
            }
            const userAgent = req.headers['user-agent'];
            const ip = req.ip;
            const result = await AuthServices.validateLoginSession({
                user_ID: user._id,
                device_ID: device_ID,
                ip,
                userAgent,
            });
            const { is_session, is_enabled2fa, is_trustDevices, is_verify2fa } =
                result;
            const needsVerification =
                is_session && is_enabled2fa && !is_trustDevices;
            if (needsVerification) {
                return res.status(403).json({ error: 'you need to verify!' });
            }
            //  tạo token và kiểm tra
            // tạo jwt
            const profile = { user_ID, device_ID, role };
            const AccessToken = await newAccessToken(profile);
            const RefreshToken = await newRefreshToken({ profile });
            const tokenStr = RefreshToken?.startsWith('Bearer ')
                ? RefreshToken.split(' ')[1]
                : RefreshToken;
            await res.cookie('refreshToken', RefreshToken, setTokenInCookie());
            // thêm cookie vào db
            await TokenService.addToken({
                ip,
                device_ID,
                userAgent,
                user_ID,
                token: tokenStr,
            });
            const { password, ...other } = user._doc;
            return res.status(200).json({ data: other, meta: { AccessToken } });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();
