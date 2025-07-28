const express = require('express');

const router = express.Router();
const CheckoutController = require('../../app/Controller/User/CheckoutController');

// [GET]
router.get('/', CheckoutController.getCheckout);
// [POST]
router.post('/add', CheckoutController.addVoucherCheckout);
// [PATCH]
router.patch('/add-voucher', CheckoutController.addVoucherCheckout);
router.patch('remove-voucher', CheckoutController.removeVoucher);

module.exports = router;
