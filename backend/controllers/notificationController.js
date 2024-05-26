const Notification = require("../models/Notification");
const User = require("../models/User");
const NotificationUser = require("../models/NotificationUser");
const jwt = require("jsonwebtoken");
const NotificationConstant = require("../constants/notification");

const notificationController = {

    /**
     * get all notifications
     *
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    getAllNotifications: async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
            const {type} = req.query
            const notifications = await Notification.find({
                ...(type && {type}),
                createdBy: decoded.id
            })
                .lean()
                .sort({updatedAt: -1})
            const response = [];
            for (const notification of notifications) {
                const employments = (await NotificationUser.find({
                    notificationId: notification._id
                })
                    .populate('userId')
                    .lean()
                    .exec())
                    .map(o => o.userId)
                    .map(user => ({_id: user._id, fullname: user.fullname}));
                response.push({
                    ...notification,
                    employments
                })
            }

            // response
            res.status(200).json(response)
        } catch (err) {
            res.status(500).json(err)
        }
    },


    /**
     * create notification
     *
     * @request-body:
     *  the structure of body request should be:
     *      {
     *          title?: string
     *          message: string
     *          type: NotificationConstant.type
     *          employments: Array<userId>
     *      }
     *
     * @returns {Promise<void>}
     */
    createNotification: async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
            const body = req.body || {}

            // create record for notification
            const savedNotification = await (new Notification({
                ...body,
                createdBy: decoded.id
            })).save();

            // create record for user notification
            if (body.type === NotificationConstant.type.Internal) {
                // for case the notification type is 'Internal'
                const users = (await User.find({})) || [];
                const userIds = users.map(user => user._id);
                const notificationUsers = userIds.map(userId => ({
                    notificationId: savedNotification._id,
                    userId,
                }));
                await NotificationUser.insertMany(notificationUsers)
            } else {
                await NotificationUser.insertMany((body.employments || []).map(userId => new NotificationUser({
                    notificationId: savedNotification._id,
                    userId
                })))
            }

            return res.status(200).json(savedNotification)
        } catch (err) {
            return res.status(400).json(err)
        }
    },

    /**
     * get list notification of specific user
     *
     * @returns {Promise<void>}
     */
    getNotificationByUserId: async (req, res) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);

            const {userId} = req.params
            const userNotifications = await NotificationUser
                .find({userId: userId || decoded.id})
                .populate('notificationId')
                .sort({updatedAt: -1})
                .lean()
                .exec();

            const notifications = (userNotifications || []).map(o => ({
                ...o.notificationId,
                status: o.status
            }))
            return res.status(200).json(notifications)
        } catch (err) {
            return res.status(400).json(err)
        }
    },

    /**
     * update notification
     *
     * @request-body:
     *  the structure of body request should be:
     *      {
     *          title?: string
     *          message: string
     *          employments?: Array<userId>
     *      }
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    updateNotification: async (req, res) => {
        try {
            const {notificationId} = req.params
            const body = req.body || {}

            const notification = await Notification.findById(notificationId)

            if (!notification) {
                return res.status(400).json('Notification is not exited')
            }

            const updatedRes = await Notification.findByIdAndUpdate(notificationId,
                {
                    $set: {
                        ...(body.title && {title: body.title}),
                        ...(body.message && {message: body.message})
                    }
                }, {new: true})

            if (body.employments && (notification.type !== NotificationConstant.type.Internal)) {
                // remove old data
                await NotificationUser.deleteMany({
                    notificationId
                })

                // insert new users
                await NotificationUser.insertMany((body.employments || []).map(o => new NotificationUser({
                    notificationId,
                    userId: o
                })))
            }

            return res.status(200).json(updatedRes)
        } catch (err) {
            return res.status(400).json(err)
        }
    },

    /**
     * delete notification
     *
     */
    deleteNotification: async (req, res) => {
        try {
            const {notificationId} = req.params
            await NotificationUser.deleteMany({
                notificationId
            })
            await Notification.findByIdAndDelete(notificationId)
            return res.status(200).json('Delete successfully')
        } catch (err) {
            return res.status(400).json(err)
        }
    },

    /**
     * mark all user's notification was read
     *
     */
    markReadOfUser: async (req, res) => {
        try {
            const {userId} = req.params
            await NotificationUser.updateMany({
                userId
            }, {
                status: NotificationConstant.status.Read
            })
            return res.status(201).json('Successfully')
        } catch (err) {
            return res.status(400).json(err)
        }
    },

    /**
     * count no read of user
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    countNoReadOfUser: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
        try {
            const {userId} = req.params
            const count = await NotificationUser.count({
                userId: userId || decoded?.id,
                status: NotificationConstant.status.Unread
            })
            return res.status(200).json(count || 0)
        } catch (err) {
            return res.status(400).json(err)
        }
    }
}

module.exports = notificationController;
