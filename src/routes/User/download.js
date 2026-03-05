const express = require('express');
const router = express.Router();

const DownloadController = require('../../app/Controller/User/DownloadController');

// [GET]
router.get('/:project_ID', DownloadController.downloadProject);

module.exports = router;
