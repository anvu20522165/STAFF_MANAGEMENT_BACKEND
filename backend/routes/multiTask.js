const multiTaskController = require("../controllers/multiTaskController");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndUserAuthorization,
} = require("../controllers/verifyToken");

const router = require("express").Router();
//GET ALL USERS
router.get("/", verifyToken, multiTaskController.getAllMultiTask);
router.get("/:id", verifyToken, multiTaskController.getById);
router.put("/:id", verifyToken, multiTaskController.updateDeparmentStatus);
router.post("/", verifyToken, multiTaskController.addNewMultiTask)

module.exports = router;