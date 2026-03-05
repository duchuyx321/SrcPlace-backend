const express = require('express');

const router = express.Router();

const UserController = require('../../app/Controller/Admin/UserController');
const CloudinaryMiddleware = require('../../app/Middleware/CloudinaryMiddleware');
// [GET]
router.get('overview', UserController.overview);
// [POST]
// [PATCH]
router.patch(
    'edit',
    CloudinaryMiddleware.uploadCloudinary({ type: 'Avatar' }).single(
        'file_avatar',
    ),
    UserController.editUser,
);
router.patch('/restore', UserController.restoreUsers);
// [DELETE]
router.delete('/delete', UserController.deleteUsers);
router.delete('/destroy', UserController.destroyUsers);

module.exports = router;
