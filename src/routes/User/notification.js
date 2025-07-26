const express = require('express');
const router = express.Router();

const NotificationController = require('../../app/Controller/User/NotificationController');

router.get('/', NotificationController.getNotifications);
router.get('/read', NotificationController.readNotification);

module.exports = router;
