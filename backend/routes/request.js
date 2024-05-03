const requestController = require("../controllers/requestController");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndUserAuthorization,
} = require("../controllers/verifyToken");

const router = require("express").Router();
//GET ALL USERS
router.get("/", verifyToken, requestController.getAllRequests);
router.post("/", requestController.addNewRequest)

module.exports = router;