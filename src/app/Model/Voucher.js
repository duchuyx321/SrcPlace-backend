const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VoucherSchema = new Schema(
    {
        code: {
            type: String,
            require: true,
            unique: true,
            minlength: 6,
            maxlength: 20,
        },
        voucher_type: {
            type: String,
            enum: ['percent', 'money'],
            default: 'money',
        },
        value: { type: Number, require: true },
        maxUsers: { type: Number, require: true },
        unlimited: { type: Boolean, default: false },
        used: { type: Number, require: true },
        maxPerUser: { type: Number, default: 1 },
        perUserUnlimited: { type: Boolean, default: false },
        expiresAt: { type: Date, required: true },
        proviso: {
            minOrderAmount: { type: Number, default: 0 },
            onlyForUserIDs: [{ type: Schema.Types.ObjectId }], // chỉ định user cụ thể
            applyToCategories_IDs: [{ type: Schema.Types.ObjectId }], // chỉ định một số danh mục sản phẩm theo id
            applyToProductIDs: [{ type: Schema.Types.ObjectId }], // hoặc cho 1 số sản phẩm theo id
            firstTimeUserOnly: { type: Boolean, default: false }, // chỉ user lần đầu mua
            newUserOnly: { type: Boolean, default: false }, // chỉ cho user mới  trong vòng 48h
        },
        isActive: { type: Boolean, default: true }, // có thể bật tắt nó
    },
    { timestamps: true, collection: 'Vouchers' },
);

module.exports = mongoose.model('Vouchers', VoucherSchema);
