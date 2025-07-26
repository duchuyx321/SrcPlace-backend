const express = require('express');

const router = express.Router();
const me = require('./me');
const TwoFA = require('./2fa');
const card = require('./card');
const payment = require('./payment');
const notification = require('./notification');

// [User]
router.use('/me', me);
router.use('/2fa', TwoFA);
router.use('/card', card);
router.use('/payment', payment);
router.use('/notification', notification);
module.exports = router;
