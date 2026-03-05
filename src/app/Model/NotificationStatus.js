const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const NotificationStatusSchema = new Schema(
    {
        user_ID: { type: Schema.Types.ObjectId, required: true },
        notification_ID: { type: Schema.Types.ObjectId, required: true },
        is_read: { type: Boolean, default: false },
        readAt: { type: Date },
    },
    { timestamps: true, collection: 'NotificationStatus' },
);

// plugin
NotificationStatusSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});

module.exports = mongoose.model('NotificationStatus', NotificationStatusSchema);
