const router = require("express").Router();
const departmentController = require("../controllers/departmentController");

router.get("/", departmentController.getAllDepartments);
router.post("/", departmentController.createDepartment);
router.get("/:id", departmentController.getDepartmentById);
router.put("/:id", departmentController.updateDepartment);
router.delete("/:id", departmentController.deleteDepartment);

module.exports = router;
