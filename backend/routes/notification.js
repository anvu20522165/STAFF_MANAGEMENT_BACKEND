const notificationController = require("../controllers/notificationController");
const {
    verifyToken,
    verifyDepartmentHead
} = require("../controllers/verifyToken");
const router = require("express").Router();

/**
 * get all notifications
 */
router.get('/get-all', verifyToken, notificationController.getAllNotifications)

/**
 * create notifications
 */
router.post('/create', verifyDepartmentHead, notificationController.createNotification)

/**
 * get notifications from specific user
 */
router.get('/user/:userId', verifyToken, notificationController.getNotificationByUserId)

/**
 * update notification by id
 */
router.put('/:notificationId', verifyDepartmentHead, notificationController.updateNotification)

/**
 * delete notification
 */
router.delete('/:notificationId', verifyToken, notificationController.deleteNotification)

/**
 * mark all user's notifications was read
 */
router.patch('/mark-read/user/:userId', verifyToken, notificationController.markReadOfUser)

/**
 * get count of notifications these are read
 */
router.get('/user/:userId/count-no-read', verifyToken, notificationController.countNoReadOfUser)

module.exports = router;