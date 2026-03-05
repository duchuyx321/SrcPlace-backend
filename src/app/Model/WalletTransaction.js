const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const WalletTransactionSchema = new Schema(
    {
        user_ID: { type: Schema.Types.ObjectId, required: true },
        amount: { type: Number, required: true },
        type: { type: String, enum: ['deposit', 'withdraw', 'refund'] },
        description: { type: String },
    },
    { timestamps: true, collection: 'WalletTransaction' },
);

// plugin
WalletTransactionSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});

module.exports = mongoose.model('WalletTransaction', WalletTransactionSchema);
