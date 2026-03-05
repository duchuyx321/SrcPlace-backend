const ms = require('ms');
const mongoose = require('mongoose');
const VerifyCodes = require('../app/Model/VerifyCodes');

class VerifyCodesService {
    // add VerifyCodes
    async AddVerifyCodes({
        user_ID = '',
        code = '',
        device_ID = '',
        timeEnd = '2m',
    } = {}) {
        const expiresInMs = ms(timeEnd);
        const expiresAt = new Date(Date.now() + expiresInMs);
        const userObjectId = new mongoose.Types.ObjectId(user_ID);
        const newCode = await VerifyCodes.findOneAndUpdate(
            {
                user_ID: userObjectId,
            },
            {
                $set: {
                    device_ID,
                    code,
                    expiresAt,
                },
            },
            {
                new: true,
                upsert: true,
            },
        );
        if (!newCode) {
            throw new Error({ error: 'create code in database is false' });
        }
        return {
            status: 200,
            message: 'add verify code successful',
        };
    }
    // kiểm trả VerifyCodes
    async CheckVerifyCodes({ user_ID = '', code = '', device_ID = '' } = {}) {
        const now = new Date();
        const verifyCode = await VerifyCodes.findOne({
            user_ID,
            code,
            device_ID,
        });
        if (!verifyCode || verifyCode.expiresAt < now)
            return { status: 401, message: 'Code expires or does not exist!' };

        return {
            status: 200,
            message: 'code successful',
        };
    }
}

module.exports = new VerifyCodesService();
