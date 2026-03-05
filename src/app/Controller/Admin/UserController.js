const Users = require('../../Model/Users');
const CloudinaryService = require('../../../services/CloudinaryService');
class UserController {
    //[GET] --/admin/user/overview?filter=active&sort=createdAt_asc &limit=10&page=1
    async overview(req, res, next) {
        try {
            const listSort = {
                createdAt_asc: { createdAt: 1 },
                createdAt_desc: { createdAt: -1 },
                name_asc: { name: 1 },
                name_desc: { name: -1 },
            };
            const filter = req.query.filter || 'active';
            const orderBy = req.query.sort || 'createdAt_asc';
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;

            const sort = listSort[orderBy];
            const skip = (page - 1) * limit;
            const is_deleted = filter !== 'active';
            const [users, countUserDelete] = await Promise.all([
                Users.findWithDeleted({ deleted: is_deleted })
                    .sort(sort)
                    .skip(skip)
                    .limit(limit),
            ]);
            return res.status(200).json({
                data: {
                    users,
                    countUserDelete,
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [PATCH] --/admin/user/edit
    async editUser(req, res, next) {
        const file = req.file;
        try {
            const { public_id, user_ID, ...editFields } = req.body;
            if (public_id) {
                await CloudinaryService.deleteCloudinaryFile(public_id);
                editFields.avatar = {
                    image_url: '',
                    public_id: '',
                };
            }
            if (file) {
                editFields.avatar = {
                    image_url: file.path,
                    public_id: file.filename,
                };
            }
            if (Object.keys(editFields).length === 0) {
                return res.status(403).json({ error: 'not data edit user!' });
            }
            const editUser = await Users.updateOne(
                { _id: user_ID },
                { $set: editFields },
            );
            if (editUser.modifiedCount === 0) {
                if (file) {
                    await CloudinaryService.deleteCloudinaryFile(file.filename);
                }
                return res.status(501).json('edit user is false');
            }
            return res
                .status(200)
                .json({ data: { message: 'edit user is successful' } });
        } catch (error) {
            if (file) {
                await CloudinaryService.deleteCloudinaryFile(file.filename);
            }
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [PATCH] --/admin/user/restore
    async restoreUsers(req, res, next) {
        try {
            const { user_IDs } = req.body;
            if (!Array.isArray(user_IDs) || user_IDs.length === 0) {
                return res.status(403).json({ error: 'not user restore!' });
            }
            await Users.restore({ _id: { $in: user_IDs } });
            return res
                .status(200)
                .json({ data: { message: 'restore is successful!' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: message });
        }
    }
    // [DELETE] --/admin/user/delete
    async deleteUsers(req, res, next) {
        try {
            const { user_IDs } = req.body;
            if (!Array.isArray(user_IDs) || user_IDs.length === 0) {
                return res.status(403).json({ error: 'not user delete!' });
            }
            await Users.delete({ _id: { $in: user_IDs } });
            return res
                .status(200)
                .json({ data: { message: 'delete is successful!' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: message });
        }
    }
    // [DELETE] --/admin/user/destroy
    async destroyUsers(req, res, next) {
        try {
            const { user_IDs } = req.body;
            if (!Array.isArray(user_IDs) || user_IDs.length === 0) {
                return res.status(403).json({ error: 'not user destroy!' });
            }
            await Users.deleteMany({ _id: { $in: user_IDs } });
            return res
                .status(200)
                .json({ data: { message: 'destroy is successful!' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: message });
        }
    }
}
module.exports = new UserController();
