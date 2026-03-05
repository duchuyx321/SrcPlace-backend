const DriverService = require('../../../services/DriverService');
const Downloads = require('../../Model/Downloads');
const Orders = require('../../Model/Orders');
const Projects = require('../../Model/Projects');

class DownloadController {
    // [GET] --/user/download/:project_ID
    async downloadProject(req, res, next) {
        try {
            const { project_ID } = req.params;
            const { user_ID } = req.user;
            const checkOrderSuccess = await Orders.findOne({
                user_ID,
                project_IDs: project_ID,
                status: 'paid',
            })
                .select('_id')
                .lean();
            if (!checkOrderSuccess) {
                return res
                    .status(404)
                    .json({ error: 'You have not purchased this project!' });
            }
            const checkDownloadProjects = await Downloads.findOne({
                user_ID,
                project_ID,
            })
                .select('_id')
                .lean();
            if (checkDownloadProjects) {
                return res
                    .status(403)
                    .json({ error: 'you have downloaded before!' });
            }
            const project = await Projects.findById(project_ID)
                .select('source_ID slug')
                .lean();

            const { filePath, userFriendlyName } =
                await DriverService.getFileAboutLocal({
                    source_ID: project.source_ID,
                    order_ID: checkOrderSuccess._id,
                });

            return res.download(filePath, userFriendlyName, async (err) => {
                if (err) return res.status(500).json({ err });
                const resultDelete =
                    await DriverService.deleteFileToLocal(filePath);
                if (resultDelete.status !== 200) {
                    return res
                        .status(resultDelete.status)
                        .json({ error: resultDelete.message });
                }
                // thêm download vào db
                const newDownload = new Downloads({
                    user_ID,
                    project_ID,
                    order_ID: checkOrderSuccess._id,
                });
                await newDownload.save();
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }
}
module.exports = new DownloadController();
