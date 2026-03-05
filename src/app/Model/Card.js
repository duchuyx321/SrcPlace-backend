const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const CardSchema = new Schema(
    {
        user_ID: { type: Schema.Types.ObjectId, require: true },
        project_ID: { type: Schema.Types.ObjectId, required: true },
        expiresAt: {
            type: Date,
        },
    },
    { timestamps: true, collection: 'Card' },
);
// index
CardSchema.index({ user_ID: 1, project_ID: 1 }, { unique: true });
// plugin
CardSchema.plugin(mongoose_delete, { deletedAt: true, overrideMethods: true });

module.exports = mongoose.model('Card', CardSchema);
