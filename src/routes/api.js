const express = require('express');
const passport = require('passport');

const router = express.Router();

const ApiController = require('../app/Controller/ApiController');
const { PassportProfile } = require('../app/Controller/ApiController');

// [GET] --/api
router.get(
    '/auth/google/callback',
    PassportProfile('google'),
    PassportRedirect,
);
router.get(
    '/auth/facebook/callback',
    PassportProfile('facebook'),
    PassportRedirect,
);
router.get('/auth/facebook/callback', PassportProfile(facebook));
router.get('/auth/google/callback', PassportProfile(google));
//[POST] --api
router.post('/payment/callback', ApiController.paymentCallback);
module.exports = router;
