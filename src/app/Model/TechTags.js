const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const TechTagsSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        color: { type: String },
    },
    { timestamps: true, collection: 'TechTags' },
);

// plugin
TechTagsSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});

module.exports = mongoose.model('TechTags', TechTagsSchema);
