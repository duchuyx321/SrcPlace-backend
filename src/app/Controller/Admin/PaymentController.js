const Payment = require('../../Model/Payments');

class PaymentController {
    // [GET] --/admin/payments/overview
    async overview(req, res, next) {
        try {
            await Promise.all([Payment.find().select()]);
        } catch (error) {
            console.log(error);
        }
    }
    async uploadPayment(req, res, next) {
        try {
        } catch (error) {
            console.log(error);
        }
    }
    async editPayment(req, res, next) {
        try {
        } catch (error) {
            console.log(error);
        }
    }
    async restorePayment(req, res, next) {
        try {
        } catch (error) {
            console.log(error);
        }
    }
    async deletePayment(req, res, next) {
        try {
        } catch (error) {
            console.log(error);
        }
    }
    async destroyPayment(req, res, next) {
        try {
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new PaymentController();
