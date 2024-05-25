const mongoose = require("mongoose");
const Notification = require("../constants/notification");

const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: false,
            max: 100,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            default: Notification.type.Internal
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        sentAt: {
            type: Date,
            default: Date.now,
        },
    },
    {timestamps: true}
);

// Export model Notification
module.exports = mongoose.model("Notification", notificationSchema);
