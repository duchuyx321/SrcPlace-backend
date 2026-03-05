const express = require('express');

const router = express.Router();

const PublicController = require('../app/Controller/PublicController');

// [GET] --/
router.get('/projects', PublicController.getProjectsByType);
router.get('/search', PublicController.search);
router.get('/categories', PublicController.getCategories);
router.get('/:slug', PublicController.getProjectsFlowSlug);
router.get('/', PublicController.getProjects);
//

module.exports = router;
