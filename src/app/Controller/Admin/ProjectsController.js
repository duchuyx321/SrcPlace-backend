const Projects = require('../../Model/Projects');
const CloudinaryService = require('../../../services/CloudinaryService');
const DriverService = require('../../../services/DriverService');
const SocketService = require('../../../services/SocketService');
class ProjectsController {
    // [GET] --/admin/projects/overview?filter=active&sort&limit=10&page=1
    async overview(req, res, next) {
        try {
            const filter = req.query.filter || 'active';
            const sort = req.query.sort || 'createdAt_desc';
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const listSort = {
                createdAt_asc: { createdAt: 1 },
                createdAt_desc: { createdAt: -1 },
                name_asc: { name: 1 },
                name_desc: { name: -1 },
            };
            const orderBy = listSort[sort] || { createdAt: -1 };
            const skip = (page - 1) * limit;
            const is_delete = filter !== 'active';
            const [projects, countProjectsDelete] = await Promise.all([
                Projects.findWithDeleted({ deleted: is_delete })
                    .sort(orderBy)
                    .skip(skip)
                    .limit(limit),
                Projects.countDocumentsDeleted(),
            ]);
            return res.status(200).json({
                data: {
                    projects,
                    countProjectsDelete,
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [POST] --/admin/projects/upload
    async uploadProject(req, res, next) {
        try {
            const file = req.file;
            const { source_ID } = req.body || '';
            const resultUpToDriver = await DriverService.uploadFileToDriver({
                localPath: file.path,
                fileName: file.filename,
                mimeType: file.mimetype,
                source_ID,
            });
            if (resultUpToDriver.status !== 200) {
                return res
                    .status(resultUpToDriver.status)
                    .json({ error: resultUpToDriver.error });
            }
            return res.status(200).json({
                data: {
                    message: 'upload file successful',
                    data: resultUpToDriver.data,
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [POST] --/admin/projects/add
    async addProjects(req, res, next) {
        const file = req.file;
        try {
            const { user_ID } = req.user;
            const {
                category_ID,
                title,
                price,
                description,
                teachTags,
                video_url,
                download_url,
                source_ID,
                is_proved,
                is_published,
            } = req.body;
            let image_url = file?.path || '';
            const requiredFields = [
                category_ID,
                title,
                price,
                description,
                teachTags,
                // video_url,
                // download_url,
                // source_ID,
            ];
            if (requiredFields.some((fields) => !fields)) {
                if (file) {
                    await CloudinaryService.deleteCloudinaryFile(file.filename);
                }
                return res
                    .status(403)
                    .json({ error: 'data upload not enough!' });
            }
            const projects = new Projects({
                user_ID,
                category_ID,
                title,
                teachTags,
                description,
                download_url,
                video_url,
                image_url,
                price,
                source_ID,
                is_proved: is_proved || true,
                is_published: is_published || true,
            });
            await projects.save();
            return res
                .status(200)
                .json({ data: { message: 'add project is successful' } });
        } catch (error) {
            if (file) {
                await CloudinaryService.deleteCloudinaryFile(file.filename);
            }
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [PATCH] --/admin/projects/edit
    async editProjects(req, res, next) {
        const file = req.file;
        try {
            const { project_ID, public_id, ...requiredFields } = req.body;
            if (file) {
                requiredFields.thumbnail = {
                    image_url: file.path,
                    public_id: file.fileName,
                };
                await CloudinaryService.deleteCloudinaryFile(public_id);
            }
            if (!requiredFields) {
                if (file) {
                    await CloudinaryService.deleteCloudinaryFile(file.filename);
                }
                return res
                    .status(403)
                    .json({ error: 'data upload not enough!' });
            }
            const editProjects = await Projects.updateOne(
                { _id: project_ID },
                requiredFields,
            );
            if (editProjects.modifiedCount === 0) {
                if (file) {
                    await CloudinaryService.deleteCloudinaryFile(file.filename);
                }
                return res
                    .status(503)
                    .json({ error: 'edit project is false!' });
            }
            return res
                .status(200)
                .json({ data: { message: 'edit project is successful!' } });
        } catch (error) {
            if (file) {
                await CloudinaryService.deleteCloudinaryFile(file.filename);
            }
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [PATCH] --/admin/projects/restore
    async restoreProjects(req, res, next) {
        try {
            const { user_ID } = req.body;
            const { project_IDs } = req.body;
            if (!Array.isArray(project_IDs) || project_IDs.length === 0) {
                return res
                    .status(403)
                    .json({ error: 'data upload not enough!' });
            }
            await Projects.restore({ _id: { $in: project_IDs } });
            const countProjectDelete = await Projects.countDocumentsDeleted();
            await SocketService.emitToUser(
                req.io,
                user_ID,
                'restore_count',
                countProjectDelete,
            );
            return res
                .status(200)
                .json({ data: { message: 'restore is successful!' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [DELETE] --/admin/projects/delete
    async deleteProjects(req, res, next) {
        try {
            const { user_ID } = req.user;
            const { project_IDs } = req.body;
            if (!Array.isArray(project_IDs) || project_IDs.length === 0) {
                return res
                    .status(403)
                    .json({ error: 'data upload not enough!' });
            }
            await Projects.delete({ _id: { $in: project_IDs } });
            const countProjectDelete = await Projects.countDocumentsDeleted();
            await SocketService.emitToUser(
                req.io,
                user_ID,
                'restore_count',
                countProjectDelete,
            );
            return res
                .status(200)
                .json({ data: { message: 'delete is successful!' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [DELETE] --/admin/projects/destroy
    async destroyProjects(req, res, next) {
        try {
            const { user_ID } = req.user;
            const { project_IDs } = req.body;
            if (!Array.isArray(project_IDs) || project_IDs.length === 0) {
                return res
                    .status(403)
                    .json({ error: 'data upload not enough!' });
            }
            await Projects.deleteMany({ _id: { $in: project_IDs } });
            const countProjectDelete = await Projects.countDocumentsDeleted();
            await SocketService.emitToUser(
                req.io,
                user_ID,
                'restore_count',
                countProjectDelete,
            );
            return res
                .status(200)
                .json({ data: { message: 'delete is successful!' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
}
module.exports = new ProjectsController();
