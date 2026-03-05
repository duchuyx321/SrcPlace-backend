const express = require('express');

const router = express.Router();

const PaymentController = require('../../app/Controller/User/PaymentController');

// [GET]
router.get('/payment-methods', PaymentController.getPaymentMethods);
// [POST]
router.post('/', PaymentController.createPayment);
// [PATCH]

// [DELETE]

module.exports = router;
