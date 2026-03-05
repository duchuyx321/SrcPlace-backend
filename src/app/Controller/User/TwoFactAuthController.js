const TwoFactorAuthService = require('../../../services/TwoFactorAuthService');
const TwoFactorAuth = require('../../Model/TwoFactorAuth');

class TwoFactAuthController {
    // [GET] --/user/2fa/qrcode
    async getQrcode(req, res, next) {
        try {
            const { user_ID } = req.user;
            const twoFactorAuth = await TwoFactorAuth.findOne({
                user_ID,
            }).select('qr_url');
            if (!twoFactorAuth) {
                return res
                    .status(404)
                    .json({ error: 'User has not enabled 2fa!' });
            }
            return res.status(200).json({
                data: {
                    qrcode: twoFactorAuth.qr_url,
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [POST] --/user/2fa/enable
    async enableTwoFA(req, res, next) {
        try {
            const { user_ID } = req.user;
            const twoFA = await TwoFactorAuth.findOne({ user_ID });
            if (!twoFA) {
                const createTwoFA =
                    await TwoFactorAuthService.createTwoFactorAuth(user_ID);
                if (createTwoFA.status !== 200) {
                    return res
                        .status(createTwoFA.status)
                        .json({ error: createTwoFA.error });
                }
            }
            const enable = await TwoFactorAuth.updateOne(
                { user_ID },
                { $set: { is_enabled: true } },
            );
            if (enable.modifiedCount === 0) {
                return res.status(503).json({ error: 'enable 2fa is false!' });
            }
            return res
                .status(200)
                .json({ data: { message: 'enable 2fa is successful!' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [POST] --/user/2fa/disable
    async disableTwoFA(req, res, next) {
        try {
            const { user_ID } = req.user;
            const twoFA = await TwoFactorAuth.findOne({ user_ID });
            if (!twoFA) {
                return res
                    .status(404)
                    .json({ error: 'User has not enabled 2fa!' });
            }
            const disable = await TwoFactorAuth.updateOne(
                { user_ID },
                { $set: { is_enabled: false } },
            );
            if (disable.modifiedCount === 0) {
                return res
                    .status(503)
                    .json({ error: ' disable 2fa is false!' });
            }
            return res
                .status(200)
                .json({ data: { message: ' disable 2fa is successful!' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
}

module.exports = new TwoFactAuthController();
