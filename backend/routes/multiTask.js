const multiTaskController = require("../controllers/multiTaskController");
const {
  verifyToken,
  verifyDepartmentHeadOrCEO
} = require("../controllers/verifyToken");

const router = require("express").Router();
//GET ALL USERS
router.get("/", verifyDepartmentHeadOrCEO, multiTaskController.getAllMultiTask);
router.get("/:id", verifyToken, multiTaskController.getById);
router.get("/byrequest/:requestid", multiTaskController.getByRequestId);

router.put("/:id", verifyToken, multiTaskController.updateDeparmentStatus);
router.post("/", verifyToken, multiTaskController.addNewMultiTask)

module.exports = router;