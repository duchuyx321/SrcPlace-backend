const Categories = require('../../Model/Categories');
class CategoriesController {
    // [GET] --/admin/categories/overview?filter=active&sort
    async overview(req, res, next) {
        try {
            const filter = req.query.filter || 'active';
            const sort = req.query.sort || 'createdAt_desc';
            const listSort = {
                createdAt_asc: { createdAt: 1 },
                createdAt_desc: { createdAt: -1 },
                name_asc: { name: 1 },
                name_desc: { name: -1 },
            };
            const orderBy = listSort[sort] || { createdAt: -1 };
            const is_delete = filter !== 'active';
            const [categories, countCategories] = await Promise.all([
                Categories.findWithDeleted({ deleted: is_delete })
                    .sort(orderBy)
                    .lean(),
                Categories.countDocumentsDeleted(),
            ]);
            return res.status(200).json({
                data: {
                    categories,
                    countCategories,
                },
            });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [POST] --/admin/categories/add
    async addCategories(req, res, next) {
        try {
            const { name } = req.body;
            const categories = await Categories.findOne({ name });

            if (!name) {
                return res.status(400).json({ error: 'Name is required!' });
            }

            if (categories) {
                return res.status(403).json({ data: 'Category has existed!' });
            }
            const addCategories = await Categories.findOneAndUpdateWithDeleted(
                {
                    name,
                },
                {
                    $set: {
                        deleted: false,
                        name,
                    },
                },
                { new: true, upsert: true },
            );
            return res.status(200).json({
                message: 'Category added or restored successfully',
                data: addCategories,
            });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [PATCH] --/admin/categories/edit
    async editCategories(req, res, next) {
        try {
            const { categories_ID, name } = req.body;
            if (!categories_ID || !name)
                return res
                    .status(400)
                    .json({ error: 'Data sent to incomplete!' });

            // Kiểm tra name đã tồn tại ở category khác chưa
            const existing = await Categories.findOne({
                _id: { $ne: categories_ID },
                name,
            });

            if (existing) {
                return res
                    .status(400)
                    .json({ error: 'Category name already exists!' });
            }
            const edit = await Categories.updateOne(
                { _id: categories_ID },
                {
                    $set: { name },
                },
            );
            if (edit.modifiedCount === 0) {
                return res.status(501).json({ error: 'edit is false!' });
            }
            return res
                .status(200)
                .json({ data: { message: 'edit is successful!' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [PATCH] --/admin/categories/restore
    async restoreCategories(req, res, next) {
        try {
            const { categories_IDs } = req.body;
            await Categories.restore({ _id: { $in: categories_IDs } });
            return res
                .status(200)
                .json({ data: { message: 'restore successful!' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [delete] --/admin/categories/delete
    async deleteCategories(req, res, next) {
        try {
            const { categories_IDs } = req.body;
            await Categories.delete({ _id: { $in: categories_IDs } });
            return res
                .status(200)
                .json({ data: { message: 'delete successful!' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
    // [delete] --/admin/categories/destroy
    async destroyCategories(req, res, next) {
        try {
            const { categories_IDs } = req.body;
            await Categories.deleteMany({ _id: { $in: categories_IDs } });
            return res
                .status(200)
                .json({ data: { message: 'destroy successful!' } });
        } catch (error) {
            console.log(error);
            return res.status(501).json({ error: error.message });
        }
    }
}
module.exports = new CategoriesController();
