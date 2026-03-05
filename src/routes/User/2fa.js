const express = require('express');

const router = express.Router();

const VerifyCodesMiddleware = require('../../app/Middleware/VerifyCodeMiddleware');
const TwoFactAuthController = require('../../app/Controller/User/TwoFactAuthController');

// [GET]
router.get('/qrcode', TwoFactAuthController.getQrcode);
// [POST]
router.post(
    '/enable',
    VerifyCodesMiddleware.VerifyCode,
    TwoFactAuthController.enableTwoFA,
);
// [PATCH]
router.patch(
    '/disable',
    VerifyCodesMiddleware.VerifyCode,
    TwoFactAuthController.disableTwoFA,
);

module.exports = router;
