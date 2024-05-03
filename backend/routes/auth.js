const authController = require("../controllers/authController");

const router = require("express").Router();
const { verifyToken, verifyTokenAndUserAuthorization, verifyTokenAndAdmin} = require("../controllers/verifyToken");

//REGISTER
router.post("/register", authController.registerUser);

//check token for frontend
router.post("/checkAuth", authController.checkAuth);

//REFRESH TOKEN
router.post("/refresh", authController.requestRefreshToken);
//LOG IN
router.post("/login", authController.loginUser);
//LOG OUT
router.post("/logout", verifyToken, authController.logOut);

//CHANGE USER'S PASSWORD
router.put("/password/:id", verifyTokenAndUserAuthorization, authController.updatePassword);

module.exports = router;