const express = require('express');

const router = express.Router();

const ProjectsController = require('../../app/Controller/Admin/ProjectsController');
const CloudinaryMiddleware = require('../../app/Middleware/CloudinaryMiddleware');

// [GET]
router.get('/overview', ProjectsController.overview);
// [POST]
router.post(
    '/upload',
    CloudinaryMiddleware.uploadLocal.single('file_sources'),
    ProjectsController.uploadProject,
);
router.post(
    '/add',
    CloudinaryMiddleware.uploadCloudinary({ type: 'Thumbnail' }).single(
        'file_thumbnail',
    ),
    ProjectsController.addProjects,
);
// [PATCH]
router.patch('/edit', ProjectsController.editProjects);
router.patch('/restore', ProjectsController.restoreProjects);
// [DELETE]
router.delete('/delete', ProjectsController.deleteProjects);
router.delete('/destroy', ProjectsController.destroyProjects);
module.exports = router;
