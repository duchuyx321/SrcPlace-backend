const Orders = require('../../Model/Orders');

const { getStartEndDate } = require('../../../util/dayUtil');

class DashboardController {
    // [GET] --/admin/dashboard/order?year=2025
    async getOrderStatus(req, res, next) {
        try {
            const year = parseInt(req.query.year) || new Date().getFullYear();
            const { startDate, endDate } = getStartEndDate(year);
            const orders = await Orders.aggregate([
                {
                    $math: {
                        createdAt: { $gte: startDate, $lte: endDate },
                    },
                },
                {
                    $facet: {
                        monthly: [
                            {
                                $group: {
                                    _id: { $month: '$createdAt' },
                                    totalOrders: { $sum: 1 },
                                },
                            },
                            { $sort: { $_id: 1 } },
                            {
                                $project: {
                                    _id: 0,
                                    month: '$_id',
                                    totalOrders: 1,
                                },
                            },
                        ],
                        statusSummary: [
                            {
                                $group: {
                                    _id: '$status',
                                    count: { $sum: 1 },
                                },
                            },
                            {
                                $project: {
                                    _id: 0,
                                    status: '$_id',
                                    count: 1,
                                },
                            },
                        ],
                    },
                },
            ]);
            return res.status(200).json({ data: orders[0] });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [GET] --/admin/dashboard/payment?year=2025
    async getPaymentStatus(req, res, next) {
        try {
            const { year } = req.query;
            const { startDate, endDate } = getStartEndDate();
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
}

module.exports = new DashboardController();
