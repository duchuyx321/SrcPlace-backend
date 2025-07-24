const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const UsersSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 6,
            maxlength: 15,
        },
        password: { type: String, minlength: 8 },
        email: { type: String, required: true },
        role: {
            type: String,
            required: true,
            enum: ['User', 'Admin'],
            default: 'User',
        },
        avatar: { image_url: { type: String }, public_id: { type: String } },
        first_name: { type: String, minlength: 1, maxlength: 30 },
        last_name: { type: String, minlength: 1, maxlength: 30 },
        is_blocked: { type: Boolean, default: false },
        is_verified: { type: Boolean, default: false },
    },
    { timestamps: true, collection: 'Users' },
);

//  plugin
UsersSchema.plugin(mongoose_delete, { deletedAt: true, overrideMethods: true });

module.exports = mongoose.model('Users', UsersSchema);
