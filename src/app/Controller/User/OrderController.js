const Orders = require('../../Model/Orders');
const Projects = require('../../Model/Projects');
const Downloads = require('../../Model/Downloads');

class OrderController {
    // [GET] --/user/order/:order_ID
    async getProjectByOrderID(req, res, next) {
        try {
            const { user_ID } = req.body;
            const { order_ID } = req.params;
            const orderCurrent = await Orders.findOne({
                _id: order_ID,
                user_ID,
            }).select('project_IDs status');
            if (!orderCurrent) {
                return res.status(404).json({
                    error: 'Order not found or does not belong to the user!',
                });
            }
            const { project_IDs, status } = order_ID;
            const [projects, downloadList] =
                await Promise.all[
                    (Projects.find({
                        _id: { $in: project_IDs },
                    })
                        .select('title thumbnail')
                        .lean(),
                    Downloads.find({
                        user_ID,
                        project_ID: { $in: project_IDs },
                        order_ID,
                    })).select('project_ID')
                ];
            const download_IDs = downloadList.map((item) => item.project_ID);
            const projectsWithStatus = projects.map((project) => ({
                ...project,
                isDownloaded: download_IDs.includes(project._id),
            }));
            return res.status(200).json({ data: { projects, status } });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
module.exports = new OrderController();
