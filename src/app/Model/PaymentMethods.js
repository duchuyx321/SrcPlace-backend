const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const PaymentMethodsSchema = new Schema(
    {
        name: { type: String, required: true },
        code: { type: String, required: true, lowercase: true, unique: true },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        config: {
            accessKey: { type: String, required: true }, // cần mã hóa trước khi đưa vào code
            callbackUrl: { type: String, required: true },
            secretKey: { type: String, require: true },
            partnerCode: { type: String, required: true }, // cần mã hóa trước khi đưa vào code
        },
        logo: {
            image_url: { type: String },
            public_id: { type: String },
        },
    },
    { timestamps: true, collection: 'PaymentMethods' },
);

// plugin
PaymentMethodsSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});

module.exports = mongoose.model('PaymentMethods', PaymentMethodsSchema);
