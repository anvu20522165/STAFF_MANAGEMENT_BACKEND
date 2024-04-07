const Department = require("../models/Department");


const departmentController = {
  // Lấy tất cả các phòng ban
  getAllDepartments:async (req, res) => {
    try {
      const departments = await Department.find();
      res.json(departments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  
  // Tạo một phòng ban mới
  createDepartment: async (req, res) => {
    const department = new Department({
      TenPB: req.body.TenPB,
      TruongPhong: req.body.TruongPhong,
    });
    try {
      const newDepartment = await department.save();
      res.status(201).json(newDepartment);
    } catch (err) {
      console.error(err);  // Log lỗi
      res.status(400).json({ message: err.message });
    }
  },
  
  // Lấy một phòng ban theo ID
  getDepartmentById: async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      res.json(department);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  
  // Cập nhật thông tin của một phòng ban
  updateDepartment: async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      department.TenPB = req.body.TenPB || department.TenPB;
      department.TruongPhong = req.body.TruongPhong || department.TruongPhong;
      const updatedDepartment = await department.save();
      res.json(updatedDepartment);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  
  // Xóa một phòng ban
  deleteDepartment: async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      await department.remove();
      res.json({ message: "Department deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

}


module.exports = departmentController;