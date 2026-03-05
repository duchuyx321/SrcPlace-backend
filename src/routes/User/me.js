const express = require('express');

const router = express.Router();

const MeController = require('../../app/Controller/User/MeController');
const {
    uploadCloudinary,
} = require('../../app/Middleware/CloudinaryMiddleware');
const VerifyCodesMiddleware = require('../../app/Middleware/VerifyCodeMiddleware');

// [GET]
router.get('/', MeController.getMyProfile);
router.get('/summary', MeController.summary);
// [POST]
router.post('/send-mail', MeController.sendCodeToMail);
router.post(
    '/verifyCode',
    VerifyCodesMiddleware.VerifyCode,
    MeController.verifyCode,
);
// [PATCH]
router.patch(
    '/',
    uploadCloudinary({ type: 'Avatar' }).single('avatar'),
    MeController.updateMyProfile,
);
// [PATCH]
router.patch('/password', MeController.changePassword);
// [PATCH]

module.exports = router;
