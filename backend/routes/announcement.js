const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { verifyToken, verifyDepartmentHead } = require('../controllers/verifyToken');

// Tạo Announcement
router.post('/', verifyToken, announcementController.createAnnouncement);

// Lấy Announcement bởi ID
router.get('/:id', verifyToken, announcementController.getAnnouncementById);

// Cập nhật Announcement
router.put('/:id', verifyDepartmentHead, announcementController.updateAnnouncement);

// Xóa Announcement
router.delete('/:id', verifyDepartmentHead, announcementController.deleteAnnouncement);

module.exports = router;
