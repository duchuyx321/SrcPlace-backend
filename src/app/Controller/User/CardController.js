const ms = require('ms');
const Card = require('../../Model/Card');
const Projects = require('../../Model/Projects');
const SocketService = require('../../../services/SocketService');

class CardController {
    // [GET] --/user/card
    async getCards(req, res, next) {
        try {
            const { user_ID } = req.user;
            const now = new Date();
            const cards = await Card.find({
                user_ID,
                expiresAt: { $gt: now },
            })
                .select('project_ID -_id')
                .sort({ createdAt: -1 })
                .lean();

            const project_IDs = cards.map((c) => c.project_ID);
            const projects = await Projects.find({
                _id: { $in: project_IDs },
            }).select('title price image_url slug');
            return res.status(200).json({ data: projects });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [POST] --/user/card/add
    async addCards(req, res, next) {
        try {
            const { user_ID } = req.user;
            const { project_ID } = req.body;
            const expiresAt = new Date(Date.now() + ms('30d'));
            if (!project_ID) {
                return res.status(400).json({
                    error: 'project_ID is required',
                });
            }
            await Card.findOneAndUpdateWithDeleted(
                { user_ID, project_ID },
                {
                    $set: {
                        expiresAt,
                        deleted: false,
                        deletedAt: null,
                    },
                },
                { new: true, upsert: true },
            );
            return res
                .status(200)
                .json({ data: { message: 'Create card is successful!' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [DELETE] --/user/card/delete
    async deletedCards(req, res, next) {
        try {
            const { user_ID } = req.user;
            const { card_IDs } = req.body;
            if (!Array.isArray(card_IDs) || card_IDs.length === 0) {
                return res.status(400).json({
                    error: 'card_IDs is required and must be an array',
                });
            }
            await Card.delete({ user_ID, _id: { $in: card_IDs } });
            return res
                .status(200)
                .json({ data: { message: 'delete cards is successful' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [DELETE] --/user/card/destroy
    async destroyCards(req, res, next) {
        try {
            const { user_ID } = req.user;
            const { card_IDs } = req.body;
            if (!Array.isArray(card_IDs) || card_IDs.length === 0) {
                return res.status(400).json({
                    error: 'card_IDs is required and must be an array',
                });
            }
            await Card.deleteMany({ user_ID, _id: { $in: card_IDs } });

            return res
                .status(200)
                .json({ data: { message: 'delete cards is successful' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
}

module.exports = new CardController();
