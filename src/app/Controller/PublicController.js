const Projects = require('../Model/Projects');
const Categories = require('../Model/Categories');

class PublicController {
    // [GET]--/:slug
    async getProjectsFlowSlug(req, res, next) {
        try {
            const { slug } = req.params;
            const project = await Projects.findOne({ slug }).select(
                '-download_url',
            );
            if (!project) {
                return res
                    .status(404)
                    .json({ error: 'project does not exist!' });
            }
            const { download_url, ...other } = project._doc;
            return res.status(200).json({ data: other });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [GET] --/?limit=10&page=1
    async getProjects(req, res, next) {
        try {
            const limit = parseInt(req.query.limit) || 4;
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * limit;
            const [paidProjects, freeProjects] = await Promise.all([
                Projects.find({
                    price: { $gt: 0 },
                    is_proved: true,
                    is_published: true,
                })
                    .select('title price image_url slug sold')
                    .skip(skip)
                    .limit(limit)
                    .sort({ sold: -1 }),
                Projects.find({
                    price: { $eq: 0 },
                    is_proved: true,
                    is_published: true,
                })
                    .select('title price image_url slug sold')
                    .skip(skip)
                    .limit(limit)
                    .sort({ sold: -1 }),
            ]);
            return res
                .status(200)
                .json({ data: { paidProjects, freeProjects } });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ error: error.message });
        }
    }
    // [GET] --/project?type=""&limit&page
    async getProjectsByType(req, res, next) {
        try {
            const type = req.query.type || 'paid';
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * limit;
            let projects;
            if (type === 'free' || type === 'paid') {
                const query = type === 'paid' ? { $gt: 0 } : { $eq: 0 };
                projects = await Projects.find({ price: query })
                    .select('title price image_url slug sold')
                    .skip(skip)
                    .limit(limit)
                    .sort({ sold: -1 });
            } else {
                projects = await Projects.find({ category_ID: type })
                    .select('title price image_url slug sold')
                    .skip(skip)
                    .limit(limit)
                    .sort({
                        sold: -1,
                    });
            }
            return res.status(200).json({ data: projects });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ error: error.message });
        }
    }
    // [GET] --/search?text=&limit=
    async search(req, res, next) {
        try {
            const text = req.query.text;
            const limit = parseInt(req.query.limit) || 5;
            const reg = new RegExp(text, 'i');
            const projects = await Projects.find({
                title: { $regex: reg },
            })
                .select('title slug price thumbnail')
                .limit(limit);
            return res.status(200).json({ data: projects });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ error: error.message });
        }
    }
    // [GET] --/categories
    async getCategories(req, res, next) {
        try {
            const categories = await Categories.find({});
            return res.status(200).json({ data: categories });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PublicController();
