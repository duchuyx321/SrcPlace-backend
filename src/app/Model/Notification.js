const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
    {
        notifiable_type: { type: String },
        title: { type: String },
        message: { type: String },
        notifiable_link: { type: String },
        notifiable_meta: { type: Object, default: {} },
        is_sendAll: { type: Boolean, default: false },
    },
    { timestamps: true, collection: 'Notification' },
);

// plugin
NotificationSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});

module.exports = mongoose.model('Notification', NotificationSchema);
