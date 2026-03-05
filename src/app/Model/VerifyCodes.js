const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VerifyCodesSchema = new Schema(
    {
        user_ID: { type: Schema.Types.ObjectId, require: true },
        code: { type: String, require: true },
        device_ID: { type: String, require: true },
        expiresAt: { type: Date },
    },
    { timestamps: true, collection: 'VerifyCodes' },
);

module.exports = mongoose.model('VerifyCodes', VerifyCodesSchema);
