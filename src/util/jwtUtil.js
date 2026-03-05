const jwt = require('jsonwebtoken');
const ms = require('ms');
require('dotenv').config();

const newAccessToken = async (profile) => {
    const newAccessToken = await jwt.sign(
        profile,
        process.env.JWT_ACCESS_TOKEN,
        {
            algorithm: 'HS256',
            expiresIn: process.env.TIME_ACCESS_TOKEN || '1h',
        },
    );
    return `Bearer ${newAccessToken}`;
};
const newRefreshToken = async ({ profile = {}, exp = 0 } = {}) => {
    let options = { algorithm: 'HS256' };
    if (exp !== 0) {
        profile.exp = exp; // tuyệt đối, unix timestamp
    } else {
        options.expiresIn = process.env.TIME_REFRESH_TOKEN || '7d'; // tương đối
    }

    const newRefreshToken = await jwt.sign(
        profile,
        process.env.JWT_REFRESH_TOKEN,
        options,
    );
    return `Bearer ${newRefreshToken}`;
};
const newTempToken = async (profile) => {
    const newTempToken = await jwt.sign(profile, process.env.JWT_TEMP_TOKEN, {
        algorithm: 'HS256',
        expiresIn: process.env.TIME_TEMP_TOKEN || '1h',
    });
    return `Bearer ${newTempToken}`;
};

const setTokenInCookie = () => {
    const expires = ms(process.env.TIME_REFRESH_TOKEN || '7d');
    return {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'strict',
        expires: new Date(Date.now() + expires),
    };
};

module.exports = {
    newAccessToken,
    newRefreshToken,
    newTempToken,
    setTokenInCookie,
};
