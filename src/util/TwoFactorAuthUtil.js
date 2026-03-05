const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const CryptoJS = require('crypto-js');
const { newDeviceID } = require('./deviceUtil');
require('dotenv').config();

const encrypt = async (data) => {
    const enc = await CryptoJS.AES.encrypt(
        data,
        process.env.KEY_CRYPTO,
    ).toString();
    return enc;
};
const decrypt = async (data) => {
    const dec = await CryptoJS.AES.decrypt(data, process.env.KEY_CRYPTO);
    const result = await dec.toString(CryptoJS.enc.Utf8);
    return result;
};
// Create
const createTowFactorAuth = async () => {
    try {
        const secret = speakeasy.generateSecret({
            length: 20,
            name: 'SrcPlace',
            issuer: 'SrcPlace',
        });
        const qrCodeImage = await QRCode.toDataURL(secret.otpauth_url);
        // mã hóa và tạo một backupCodes
        const hashSecret = await encrypt(secret.base32);
        const backupCodes = await newDeviceID();
        const hashBackupCodes = await encrypt(backupCodes);
        return {
            status: 200,
            qrCodeImage,
            secret: hashSecret,
            backupCodes: hashBackupCodes,
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            error: 'Không thể tạo mã xác thực 2FA.',
            message: error.message,
        };
    }
};
const is_TowFactorAuth = async ({ hashSecret = '', token = '' } = {}) => {
    const secret = await decrypt(hashSecret);
    const isValid = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: 1,
    });
    return isValid;
};
module.exports = { createTowFactorAuth, is_TowFactorAuth };
