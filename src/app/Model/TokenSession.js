const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const TokenSessionSchema = new Schema(
    {
        user_ID: { type: Schema.Types.ObjectId, required: true },
        device_ID: {
            type: String,
            required: true,
        },
        token: { type: String, required: true },
        userAgent: { type: String },
        ip: { type: String },
        is_revoked: { type: Boolean, default: false },
        expiresAt: { type: Date },
    },
    { timestamps: true, collection: 'TokenSession' },
);
// index
TokenSessionSchema.index({ user_ID: 1, device_ID: 1 }, { unique: true });
// plugin
TokenSessionSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});

module.exports = mongoose.model('TokenSession', TokenSessionSchema);
