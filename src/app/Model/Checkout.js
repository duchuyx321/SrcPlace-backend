const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CheckoutSchema = new Schema(
    {
        user_ID: { type: Schema.Types.ObjectId, unique: true, require: true },
        product_IDs: [
            { type: Schema.Types.ObjectId, unique: true, required: true },
        ],
        voucher_IDs: [{ type: Schema.Types.ObjectId, unique: true }],
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true, collection: 'Checkout' },
);

module.exports = mongoose.model('Checkout', CheckoutSchema);
