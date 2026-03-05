const ms = require('ms');
const TokenSession = require('../app/Model/TokenSession');
require('dotenv').config();

class TokenService {
    // add token
    async addToken({
        user_ID = '',
        token = '',
        device_ID = '',
        userAgent = '',
        ip = '',
        expiresAt = '',
    } = {}) {
        if (!expiresAt) {
            const expiresInMs = ms(process.env.TIME_REFRESH_TOKEN || '7d');
            expiresAt = new Date(Date.now() + expiresInMs);
        }
        await TokenSession.findOneAndUpdateWithDeleted(
            {
                user_ID,
            },
            {
                $set: {
                    token,
                    device_ID,
                    userAgent,
                    ip,
                    expiresAt,
                    deleted: false,
                },
            },
            {
                new: true,
                upsert: true,
            },
        );
        return {
            status: 200,
            message: 'add token successful',
        };
    }
}

module.exports = new TokenService();
