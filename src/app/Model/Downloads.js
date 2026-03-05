const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const DownloadsSchema = new Schema(
    {
        project_ID: { type: Schema.Types.ObjectId, required: true },
        user_ID: { type: Schema.Types.ObjectId, required: true },
        order_ID: { type: Schema.Types.ObjectId, required: true },
    },
    { timestamps: true, collection: 'Downloads' },
);

// plugin
DownloadsSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});

module.exports = mongoose.model('Downloads', DownloadsSchema);
