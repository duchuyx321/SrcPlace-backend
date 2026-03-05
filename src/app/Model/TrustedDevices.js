const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const TrustedDevicesSchema = new Schema(
    {
        user_ID: { type: Schema.Types.ObjectId, required: true },
        device_ID: {
            type: String,
            required: true,
            unique: true,
        },
        userAgent: { type: String },
        ip: { type: String },
        expiresAt: { type: Date },
        lastUsedAt: { type: Date },
    },
    { timestamps: true, collection: 'TrustedDevices' },
);
// index
TrustedDevicesSchema.index({ user_ID: 1, device_ID: 1 }, { unique: true });
// plugin
TrustedDevicesSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});

module.exports = mongoose.model('TrustedDevices', TrustedDevicesSchema);
