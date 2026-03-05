const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const Schema = mongoose.Schema;

const ReviewsSchema = new Schema(
    {
        user_ID: { type: Schema.Types.ObjectId, required: true },
        parent_ID: { type: Schema.Types.ObjectId },
        reviewable_ID: { type: Schema.Types.ObjectId },
        reviewable_type: { type: String },
        comment: { type: String },
    },
    { timestamps: true, collection: 'Reviews' },
);

// plugin
ReviewsSchema.plugin(mongoose_delete, {
    deletedAt: true,
    overrideMethods: true,
});

module.exports = mongoose.model('Reviews', ReviewsSchema);
