const express = require('express');
const passport = require('passport');

const router = express.Router();

const {
    ApiController,
    PassportProfile,
} = require('../app/Controller/ApiController');

// [GET] --/api
router.get('/auth/google/callback', PassportProfile('google'));
router.get('/auth/facebook/callback', PassportProfile('facebook'));

//[POST] --api
router.post('/payment/callback', ApiController.paymentCallback);
module.exports = router;
