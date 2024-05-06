const requestController = require("../controllers/requestController");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndUserAuthorization,
} = require("../controllers/verifyToken");

const router = require("express").Router();
//GET ALL USERS
router.get("/", verifyToken, requestController.getAllRequests);
router.get("/:id", verifyToken, requestController.getById);
router.post("/", verifyToken, requestController.addNewRequest)
router.put("/decline/:id", verifyToken, requestController.declineRequest)

module.exports = router;