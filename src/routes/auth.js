const express = require('express');

const router = express.Router();

const AuthController = require('../app/Controller/AuthController');
const JwtMiddleware = require('../app/Middleware/JwtMiddleware');
const { uploadCloudinary } = require('../app/Middleware/CloudinaryMiddleware');

// [POST] --/auth
router.post(
    '/pre-login-check',
    JwtMiddleware.verifyTempToken,
    AuthController.PrevLoginCheck,
);
router.post(
    '/send-mail',
    JwtMiddleware.verifyTempToken,
    AuthController.sendCodeTOMail,
);
router.post(
    '/session/resume',
    JwtMiddleware.verifyTempToken,
    AuthController.resumeSession,
);
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post(
    '/refresh',
    JwtMiddleware.verifyRefreshToken,
    JwtMiddleware.verifyUserLocked,
    AuthController.refresh,
);
router.post('/logout', AuthController.logout);

module.exports = router;
