const express = require('express');

const router = express.Router();

const CategoriesController = require('../../app/Controller/Admin/CategoriesController');

// [GET]
router.get('/overview', CategoriesController.overview);
// [POST]
router.post('/add', CategoriesController.addCategories);
// [PATCH]
router.patch('/edit', CategoriesController.editCategories);
router.patch('/restore', CategoriesController.restoreCategories);
// [DELETE]
router.delete('/delete', CategoriesController.deleteCategories);
router.delete('/destroy', CategoriesController.destroyCategories);

module.exports = router;
