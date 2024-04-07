const Announcement = require("../models/Announcement");
const User = require("../models/User");
const { verifyDepartmentHead } = require('./verifyToken');

const announcementController = {
  // Tạo Announcement
  createAnnouncement: async (req, res) => {
    try {
      const newAnnouncement = new Announcement({
        ...req.body,
      });

    //   if (newAnnouncement.department !== req.user.department) {
    //     return res.status(403).json("Bạn không có quyền tạo Announcement cho phòng ban này");
    //   }

      const savedAnnouncement = await newAnnouncement.save();
      res.status(201).json(savedAnnouncement);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Lấy Announcement bởi ID
  getAnnouncementById: async (req, res) => {
    try {
      const announcement = await Announcement.findById(req.params.id).populate("listEmployee");
      if (!announcement) {
        return res.status(404).json("Announcement không tồn tại");
      }

      if (announcement.department.toString() !== req.user.department) {
        return res.status(403).json("Bạn không có quyền truy cập Announcement này");
      }

      res.status(200).json(announcement);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Cập nhật Announcement
  updateAnnouncement: async (req, res) => {
    try {
      const announcement = await Announcement.findById(req.params.id);
      if (!announcement) {
        return res.status(404).json("Announcement không tồn tại");
      }

      if (announcement.department.toString() !== req.user.department) {
        return res.status(403).json("Bạn không có quyền cập nhật Announcement này");
      }

      const updatedAnnouncement = await Announcement.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json(updatedAnnouncement);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Xóa Announcement
  deleteAnnouncement: async (req, res) => {
    try {
      const announcement = await Announcement.findById(req.params.id);
      if (!announcement) {
        return res.status(404).json("Announcement không tồn tại");
      }

      if (announcement.department.toString() !== req.user.department) {
        return res.status(403).json("Bạn không có quyền xóa Announcement này");
      }

      await Announcement.findByIdAndDelete(req.params.id);
      res.status(200).json("Announcement đã được xóa");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = announcementController;