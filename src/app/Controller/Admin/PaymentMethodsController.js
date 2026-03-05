const CloudinaryService = require('../../../services/CloudinaryService');
const { encrypt, decrypt } = require('../../../util/keyUtil');
const PaymentMethods = require('../../Model/PaymentMethods');

class PaymentMethodsController {
    // [GET] --/admin/paymentMethods/overview
    async overview(req, res, next) {
        try {
            const [paymentMethods, countPaymentMethodDelete] =
                await Promise.all([
                    PaymentMethods.find().select('-config'),
                    PaymentMethods.countDocumentsDeleted(),
                ]);
            return res.status(200).json({
                data: {
                    paymentMethods,
                    countPaymentMethodDelete,
                },
            });
        } catch (error) {
            console.log(error);
        }
    }
    // [POST] --/admin/paymentMethods/add
    async addPaymentMethod(req, res, next) {
        const file = req.file;
        try {
            const {
                name,
                code,
                status,
                accessKey,
                secretKey,
                partnerCode,
                callbackUrl,
            } = req.body;
            let image_url = file?.path || '';
            if (
                !name ||
                !code ||
                !status ||
                !accessKey ||
                !secretKey ||
                !partnerCode ||
                !callbackUrl
            ) {
                if (file) {
                    await CloudinaryService.deleteCloudinaryFile(file.filename);
                }
                return res
                    .status(403)
                    .json({ error: 'data upload not enough!' });
            }
            const encryptAccessKey = await encrypt(accessKey, 'accessKey');
            const encryptSecretKey = await encrypt(secretKey, 'secretKey');
            const encryptPartnerCode = await encrypt(
                partnerCode,
                'partnerCode',
            );
            const newPaymentMethod = new PaymentMethods({
                name,
                code: code.toLowerCase(),
                image_url,
                status,
                config: {
                    accessKey: encryptAccessKey,
                    secretKey: encryptSecretKey,
                    partnerCode: encryptPartnerCode,
                    callbackUrl,
                },
            });
            await newPaymentMethod.save();
            return res
                .status(200)
                .json({ data: { message: 'add payment method successful' } });
        } catch (error) {
            if (file) {
                await CloudinaryService.deleteCloudinaryFile(file.filename);
            }
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [PATCH] --/admin/paymentMethods/edit
    async editPaymentMethod(req, res, next) {
        const file = req.file;
        try {
            let { paymentMethod_ID, ...attributeChanges } = req.body;
            if (file) {
                attributeChanges = {
                    ...attributeChanges,
                    image_url: file.path,
                };
            }
            if (Object.keys(attributeChanges).length === 0) {
                if (file) {
                    await CloudinaryService.deleteCloudinaryFile(file.filename);
                }
                return res
                    .status(403)
                    .json({ error: 'data upload not enough!' });
            }
            if (
                attributeChanges.accessKey ||
                attributeChanges.secretKey ||
                attributeChanges.partnerCode ||
                attributeChanges.callbackUrl
            ) {
                const configUpdate = {};

                if (attributeChanges.accessKey) {
                    const encryptAccessKey = await encrypt(
                        attributeChanges.accessKey,
                        'accessKey',
                    );
                    configUpdate['config.accessKey'] = encryptAccessKey;
                    delete attributeChanges.accessKey;
                }
                if (attributeChanges.secretKey) {
                    const encryptSecretKey = await encrypt(
                        attributeChanges.secretKey,
                        'secretKey',
                    );
                    configUpdate['config.secretKey'] = encryptSecretKey;
                    delete attributeChanges.secretKey;
                }
                if (attributeChanges.partnerCode) {
                    const encryptPartnerCode = await encrypt(
                        attributeChanges.partnerCode,
                        'partnerCode',
                    );
                    configUpdate['config.partnerCode'] = encryptPartnerCode;
                    delete attributeChanges.partnerCode;
                }
                if (attributeChanges.callbackUrl) {
                    configUpdate['config.callbackUrl'] =
                        attributeChanges.callbackUrl;
                    delete attributeChanges.callbackUrl;
                }

                // Merge các thay đổi lồng vào attributeChanges
                attributeChanges = {
                    ...attributeChanges,
                    ...configUpdate,
                };
            }
            const edit = await PaymentMethods.updateOne(
                {
                    _id: paymentMethod_ID,
                },
                { $set: attributeChanges },
            );
            if (edit.modifiedCount === 0) {
                if (file) {
                    await CloudinaryService.deleteCloudinaryFile(file.filename);
                }
                return res
                    .status(501)
                    .json({ error: 'edit payment method is false!' });
            }
            return res.status(200).json({
                data: { message: 'edit payment method is successful!' },
            });
        } catch (error) {
            if (file) {
                await CloudinaryService.deleteCloudinaryFile(file.filename);
            }
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [PATCH] --/admin/paymentMethods/restore
    async restorePaymentMethod(req, res, next) {
        try {
            const [paymentMethod_IDs] = req.body;
            if (
                !Array.isArray(paymentMethod_IDs) ||
                paymentMethod_IDs.length === 0
            ) {
                return res.status(403).json({ error: 'data is not exits!' });
            }
            await PaymentMethods.restore({ _id: { $in: paymentMethod_IDs } });
            return res
                .status(200)
                .json({ data: { message: 'restore is successful' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [DELETE] --/admin/paymentMethods/delete
    async deletePaymentMethod(req, res, next) {
        try {
            const { paymentMethod_IDs } = req.body;
            if (
                !Array.isArray(paymentMethod_IDs) ||
                paymentMethod_IDs.length === 0
            ) {
                return res.status(403).json({ error: 'data is not exits!' });
            }
            await PaymentMethods.delete({ _id: { $in: paymentMethod_IDs } });
            return res
                .status(200)
                .json({ data: { message: 'delete is successful' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [DELETE] --/admin/paymentMethods/destroy
    async destroyPaymentMethod(req, res, next) {
        try {
            const { paymentMethod_IDs } = req.body;
            if (
                !Array.isArray(paymentMethod_IDs) ||
                paymentMethod_IDs.length === 0
            ) {
                return res.status(403).json({ error: 'data is not exits!' });
            }
            await PaymentMethods.deleteMany({
                _id: { $in: paymentMethod_IDs },
            });
            return res
                .status(200)
                .json({ data: { message: 'destroy is successful' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
}

module.exports = new PaymentMethodsController();
