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

//GET USER BY DEPARTMENT
router.get('/users/department',verifyToken, userController.getUserByDepartment);

//UPDATE BY ID
router.put("/:id", verifyTokenAndAdmin, userController.updateById);

//CHANGE USER'S PASSWORD
router.put("/password/:id", verifyTokenAndUserAuthorization, userController.updatePassword);

//DELETE USER
router.delete("/:id", verifyTokenAndAdmin, userController.deleteUser);

module.exports = router;