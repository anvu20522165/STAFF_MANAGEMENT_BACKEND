const mongoose = require("mongoose");
const Notification = require("../constants/notification");

const notificationUserSchema = new mongoose.Schema(
    {
        notificationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notification",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            default: Notification.status.Unread,
        },
        receivedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("notification_user", notificationUserSchema);
