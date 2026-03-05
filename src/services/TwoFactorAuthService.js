const TwoFactorAuth = require('../app/Model/TwoFactorAuth');
const {
    createTowFactorAuth,
    is_TowFactorAuth,
} = require('../util/TwoFactorAuthUtil');

class TwoFactorAuthService {
    async createTwoFactorAuth(user_ID) {
        try {
            const newTwoFA = await createTowFactorAuth();
            if (newTwoFA.status !== 200) {
                return {
                    newTwoFA,
                };
            }
            const { backupCodes, qrCodeImage, secret } = newTwoFA;
            const newTwoFactorAuth = new TwoFactorAuth({
                user_ID,
                secret,
                backupCodes,
                qrCodeImage,
                is_enabled: true,
            });
            await newTwoFactorAuth.save();
            return {
                status: 200,
                qrCodeImage,
            };
        } catch (error) {
            console.log(error);
            return {
                status: 501,
                message: 'create 2fa is false!',
                error: error.message,
            };
        }
    }
    async checkTowFactorAuth({ user_ID = '', token = '' } = {}) {
        const twoFactorAuth = new TwoFactorAuth.findOne({ user_ID });
        if (!twoFactorAuth)
            return {
                status: 401,
                message: 'User not enabled 2fa!',
            };
        const is_checkToken = await is_TowFactorAuth(
            twoFactorAuth.secret,
            token,
        );
        if (!is_checkToken)
            return {
                status: 401,
                message: 'token is false!',
            };

        return {
            status: 200,
            message: 'token is successful!',
        };
    }
}

module.exports = new TwoFactorAuthService();
