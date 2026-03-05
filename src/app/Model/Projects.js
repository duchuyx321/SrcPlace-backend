const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const slug = require('mongoose-slug-updater');

const Schema = mongoose.Schema;

const ProjectsSchema = new Schema(
    {
        user_ID: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
        category_ID: { type: Schema.Types.ObjectId, required: true },
        title: { type: String, required: true },
        price: { type: Number, default: 0 },
        description: { type: String },
        teachTags: [{ type: String }],
        thumbnail: {
            image_url: { type: String },
            public_id: { type: String },
        },
        video_url: { type: String, required: true },
        download_url: { type: String },
        source_ID: { type: String },
        is_proved: { type: Boolean, default: true },
        is_published: { type: Boolean, default: true },
        sold: { type: Number, default: 0 },
        slug: {
            type: String,
            slug: 'title',
            uniqueGroupSlug: 'slug',
        },
    },
    { timestamps: true, collection: 'Projects' },
);

// plugin
ProjectsSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});
ProjectsSchema.plugin(slug);

module.exports = mongoose.model('Projects', ProjectsSchema);
