const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const slug = require('mongoose-slug-updater');

const Schema = mongoose.Schema;

const CategoriesSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        slug: { type: String, slug: 'name' },
    },
    { timestamps: true, collection: 'Categories' },
);

// plugin
CategoriesSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});
CategoriesSchema.plugin(slug);

module.exports = mongoose.model('Categories', CategoriesSchema);
