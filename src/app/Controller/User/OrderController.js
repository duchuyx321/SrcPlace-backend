const Orders = require('../../Model/Orders');
const Projects = require('../../Model/Projects');
const Downloads = require('../../Model/Downloads');

class OrderController {
    // [GET] --/user/order/:order_ID
    async getProjectByOrderID(req, res, next) {
        try {
            const { user_ID } = req.user;
            const { order_ID } = req.params;
            const orderCurrent = await Orders.findOne({
                _id: order_ID,
                user_ID,
            }).select('project_IDs status createdAt');
            if (!orderCurrent) {
                return res.status(404).json({
                    error: 'Order not found or does not belong to the user!',
                });
            }
            const { project_IDs, status } = orderCurrent;
            const [projects, downloadList] = await Promise.all([
                Projects.find({
                    _id: { $in: project_IDs },
                })
                    .select('title thumbnail')
                    .lean(),
                Downloads.find({
                    user_ID,
                    project_ID: { $in: project_IDs },
                    order_ID,
                }).select('project_ID'),
            ]);
            const download_IDs = downloadList.map((item) =>
                item.project_ID.toString(),
            );
            const projectsWithStatus = projects.map((project) => ({
                ...project,
                createdAt: orderCurrent.createdAt,
                isDownloaded: download_IDs.includes(project._id.toString()),
            }));
            return res
                .status(200)
                .json({ data: { projectsWithStatus, status } });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    // [GET] --/user/order?page=1&limit=5
    async getOrdersProject(req, res, next) {
        try {
            const { page, limit } = req.query;
            const { user_ID } = req.user;
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const orders = await Orders.find({ user_ID })
                .select('status project_IDs createdAt')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
            const projectOrderMap = new Map();

            orders.forEach((order) => {
                order.project_IDs.forEach((projectID) => {
                    projectOrderMap.set(projectID.toString(), {
                        status: order.status,
                        createdAt: order.createdAt,
                    });
                });
            });
            const project_IDs = orders.map((item) => [...item.project_IDs]);
            const projects = await Projects.find({
                _id: { $in: project_IDs },
            }).select('title slug price');
            const projectsAndWithProp = projects.map((project) => {
                const orderInfo = projectOrderMap.get(project._id.toString());

                return {
                    ...project.toObject(),
                    status: orderInfo?.status || null,
                    createdAt: orderInfo?.createdAt || null,
                };
            });
            return res.status(200).json({ data: projectsAndWithProp });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
module.exports = new OrderController();
