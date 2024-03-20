const userController = require("../controllers/userController");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndUserAuthorization,
} = require("../controllers/verifyToken");

const router = require("express").Router();
//GET ALL USERS
router.get("/users", verifyToken, userController.getAllUsers);

//GET DETAIL BY ID
router.get("/:id", userController.getById);

//UPDATE BY ID
router.put("/:id", verifyTokenAndAdmin, userController.updateById);


//DELETE USER
router.delete("/:id", verifyTokenAndAdmin, userController.deleteUser);

module.exports = router;