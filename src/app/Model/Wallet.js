const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const WalletSchema = new Schema(
    {
        user_ID: { type: Schema.Types.ObjectId, required: true, unique: true },
        balance: { type: Number, default: 0 },
        unit: { type: String, enum: ['VND', ' USD'], default: 'VND' },
    },
    { timestamps: true, collection: 'Wallet' },
);

// plugin
WalletSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});

module.exports = mongoose.model('Wallet', WalletSchema);
