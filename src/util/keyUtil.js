const CryptoJS = require('crypto-js');
const crypto = require('crypto');
require('dotenv').config();

const listType = {
    accessKey: process.env.KEY_PAYMENT_METHOD_ACCESSKEY,
    secretKey: process.env.KET_PAYMENT_METHOD_SECRETKEY,
    partnerCode: process.env.KEY_PAYMENT_METHOD_PARTNER_CODE,
};
const encrypt = async (data, type) => {
    const enc = await CryptoJS.AES.encrypt(data, listType[type]).toString();
    return enc;
};
const decrypt = async (data, type) => {
    const dec = await CryptoJS.AES.decrypt(data, listType[type]);
    const result = dec.toString(CryptoJS.enc.Utf8);
    return result;
};
const newSignatureCallback = ({
    accessKey = '',
    secretKey = '',
    amount = '',
    extraData = '',
    message = '',
    orderId = '',
    orderInfo = '',
    orderType = '',
    partnerCode = '',
    payType = '',
    requestId = '',
    responseTime = '',
    resultCode = '',
    transId = '',
} = {}) => {
    const rawSignature =
        `accessKey=${accessKey}` +
        `&amount=${amount}` +
        `&extraData=${extraData}` +
        `&message=${message}` +
        `&orderId=${orderId}` +
        `&orderInfo=${orderInfo}` +
        `&orderType=${orderType}` +
        `&partnerCode=${partnerCode}` +
        `&payType=${payType}` +
        `&requestId=${requestId}` +
        `&responseTime=${responseTime}` +
        `&resultCode=${resultCode}` +
        `&transId=${transId}`;

    return crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
};
module.exports = { encrypt, decrypt, newSignatureCallback };
