const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const TwoFactorAuthSchema = new Schema(
    {
        user_ID: { type: String, required: true, unique: true },
        secret: { type: String, required: true }, // cần mã hóa trước khi lưu vào db
        is_enabled: { type: Boolean, default: false },
        is_verified: { type: Boolean, default: false },
        backupCodes: { type: String, required: true },
        qr_url: { type: String },
    },
    { timestamps: true, collection: 'TwoFactorAuth' },
);

// plugin
TwoFactorAuthSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});

module.exports = mongoose.model('TwoFactorAuth', TwoFactorAuthSchema);
