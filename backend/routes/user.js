const userController = require("../controllers/userController");
const {
  verifyToken,
  verifyTokenAndUserAuthorization,
  verifyDepartmentHead
} = require("../controllers/verifyToken");

const router = require("express").Router();
//GET ALL USERS
router.get("/users", verifyToken, userController.getAllUsers);

//GET DETAIL BY ID
router.get("/:id", userController.getById);

//GET USER BY DEPARTMENT
router.get('/users/department',verifyToken, userController.getUserByDepartment);

//UPDATE BY ID
router.put("/:id", userController.updateById);

//CHANGE USER'S PASSWORD
router.put("/password/:id", verifyTokenAndUserAuthorization, userController.updatePassword);

//CHANGE USER'S PASSWORD DEFAULT
router.put("/defaultPassword/:id", userController.restorePassword);

//DELETE USER
router.delete("/:id", verifyDepartmentHead, userController.deleteUser);

module.exports = router;