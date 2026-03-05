const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VoucherUsedBySchema = new Schema(
    {
        user_ID: { type: Schema.Types.ObjectId, require: true },
        voucher_ID: { type: Schema.Types.ObjectId, require: true },
        countUses: { type: Number, default: 1 },
    },
    { timestamps: true, collection: 'VoucherUsedBy' },
);

module.exports = mongoose.model('VoucherUsedBy', VoucherUsedBySchema);
