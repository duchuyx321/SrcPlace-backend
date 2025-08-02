const express = require('express');
const router = express.Router();

const OrderController = require('../../app/Controller/User/OrderController');

// router.get('/', OrderController.);
router.get('/:order_ID', OrderController.getProjectByOrderID);

module.exports = router;
