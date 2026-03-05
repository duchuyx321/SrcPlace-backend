const express = require('express');

const router = express.Router();

const PaymentMethodsController = require('../../app/Controller/Admin/PaymentMethodsController');
const {
    uploadCloudinary,
} = require('../../app/Middleware/CloudinaryMiddleware');

// [GET]
router.get('/overview', PaymentMethodsController.overview);
// [POST]
router.post(
    '/add',
    uploadCloudinary({ type: 'Logo' }).single('file_payment'),
    PaymentMethodsController.addPaymentMethod,
);
// [PATCH]
router.patch(
    '/edit',
    uploadCloudinary({ type: 'Logo' }).single('file_payment'),
    PaymentMethodsController.editPaymentMethod,
);
router.patch('/restore', PaymentMethodsController.restorePaymentMethod);
// [DELETE]
router.delete('/delete', PaymentMethodsController.deletePaymentMethod);
router.delete('/destroy', PaymentMethodsController.destroyPaymentMethod);

module.exports = router;
