const jwt = require('jsonwebtoken');
const Announcement = require("../models/Announcement");
const User = require("../models/User");
const { verifyDepartmentHead } = require('./verifyToken');

const announcementController = {
  // Tạo Announcement
  createAnnouncement: async (req, res) => {
    try {
      // Giải mã token để lấy department
      const token = req.headers.authorization.split(' ')[1]; // Lấy token từ header
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      const department = decoded.department;

      // Tạo mới announcement từ req.body và department từ decoded token
      const newAnnouncement = await new Announcement({
        ...req.body,
        department,
      });

      // Kiểm tra quyền của user
      if (newAnnouncement.department !== department) {
        return res.status(403).json("Bạn không có quyền tạo Announcement cho phòng ban này");
      }

      const savedAnnouncement = await newAnnouncement.save();
      return res.status(200).json(savedAnnouncement);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  // Lấy ra tất cả Announcement
 getAllAnnouncements: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1]; // Lấy token từ header
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      const userDepartment = decoded.department; // Lấy department từ user tạo request
      const userPosition = decoded.position;
      const userFullname = decoded.fullname; 
      let announcements = [];

      if (userPosition !== 'TRUONG_PHONG') {
        const allAnnouncements = await Announcement.find({ department: userDepartment });
        // Kiểm tra xem userFullname có thuộc vào listEmployee của bất kỳ announcement nào không
        allAnnouncements.forEach(announcement => {
          const employeeList = announcement.listEmployee[0].split(',').map(name => name.trim());
          if (employeeList.includes(userFullname)) {
            announcements.push(announcement);
          }
        });
      } else {
        announcements = await Announcement.find({ department: userDepartment });
      }
      return res.status(200).json(announcements);
  } catch (err) {
      return res.status(500).json(err);
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
      return res.status(500).json(err);
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
      return res.status(500).json(err);
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
      return res.status(200).json("Announcement đã được xóa");
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};

module.exports = announcementController;
