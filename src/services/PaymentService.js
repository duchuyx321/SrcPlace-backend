const axios = require('axios');
const crypto = require('crypto');
const Payments = require('../app/Model/Payments');
class PaymentService {
    createSignature({
        accessKey = '',
        secretKey = '',
        amount = '',
        extraData = '',
        ipnUrl = '',
        orderId = '',
        orderInfo = '',
        partnerCode = '',
        redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b',
        requestId = '',
        requestType = '',
    } = {}) {
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        const rawSignature =
            'accessKey=' +
            accessKey +
            '&amount=' +
            amount +
            '&extraData=' +
            extraData +
            '&ipnUrl=' +
            ipnUrl +
            '&orderId=' +
            orderId +
            '&orderInfo=' +
            orderInfo +
            '&partnerCode=' +
            partnerCode +
            '&redirectUrl=' +
            redirectUrl +
            '&requestId=' +
            requestId +
            '&requestType=' +
            requestType;

        //signature
        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        return signature;
    }
    gatewayMap(code) {
        const map = {
            MOMO: this.createPaymentMoMo.bind(this),
            // ZALOPAY: this.createPaymentZalopay,
            // VNPAY: this.createPaymentVnpay,
        };
        return map[code];
    }
    async createPaymentMoMo({
        accessKey = '',
        secretKey = '',
        callback = '',
        amount = 0,
        orderInfo = '',
        partnerCode = 'MOMO',
    }) {
        //parameters
        const redirectUrl =
            'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
        const ipnUrl = callback;
        const requestType = 'payWithMethod';
        const orderId = partnerCode + new Date().getTime();
        const requestId = orderId;
        const extraData = '';
        const orderGroupId = '';
        const autoCapture = true;
        const lang = 'vi';

        //before sign HMAC SHA256 with format
        const signature = this.createSignature({
            accessKey,
            secretKey,
            amount,
            extraData,
            ipnUrl,
            orderId,
            orderInfo,
            partnerCode,
            redirectUrl,
            requestId,
            requestType,
        });
        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: 'Test',
            storeId: 'MomoTestStore',
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature,
        });
        //Create the HTTPS objects
        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
            data: requestBody,
        };
        try {
            const result = await axios(options);
            return {
                status: 200,
                message: result.data,
            };
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
    async createPaymentDB({
        user_ID = '',
        paymentable_type = '',
        paymentable_ID = '',
        status = 'pending',
        transactionCode = '',
        price = 0,
        paidAt = '',
    } = {}) {
        try {
            const payment = new Payments({
                user_ID,
                paymentable_type,
                paymentable_ID,
                status,
                transactionCode,
                price,
                paidAt,
            });
            await payment.save();
            return payment;
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }
}

module.exports = new PaymentService();
