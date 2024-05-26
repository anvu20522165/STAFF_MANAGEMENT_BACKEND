const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const authController = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      const checkName = await User.findOne({ username: req.body.username });
      const checkEmail = await User.findOne({ username: req.body.email });
      if (checkName || checkEmail) {
        return res.status(404).json("This user has already existed");
      }
      //Create new user
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
        department: req.body.department,
        cccd: req.body.cccd,
        birth: req.body.birth,
        position: req.body.position,
        gender: req.body.gender,
        phone: req.body.phone,
        fullname: req.body.fullname,
      });
      //Save user to DB
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        fullname:user.fullname,
        avt: user.avt,
        isAdmin: user.isAdmin,
        position:user.position,
        department: user.department,
        birthday: user.birth
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1d" }
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
        avt: user.avt,
        fullname:user.fullname,
        isAdmin: user.isAdmin,
        position:user.position,
        department: user.department,
        birthday: user.birth
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },

  //LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).json("Incorrect username");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(404).json("Incorrect password");
      }
      if (user && validPassword) {
        //Generate access token
        const accessToken = authController.generateAccessToken(user);
        //Generate refresh token
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        //STORE REFRESH TOKEN IN COOKIE
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const { password, ...others } = user._doc;
        return res.status(200).json({ ...others, accessToken, refreshToken });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  //custom
  requestRefreshToken: async (req, res) => {
    //Take refresh token from user
    //const refreshToken = req.cookies.refreshToken;
    const refreshToken = req.body.refreshToken;
    //Send error if token is not valid
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      //create new access token, refresh token and send to user
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      console.log(refreshTokens)
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  },

  //LOG OUT
  logOut: async (req, res) => {
    //Clear cookies when user logs out
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    res.clearCookie("refreshToken");
    res.status(200).json("Logged out successfully!");
  },


  //CHECK if TOKEN is still valid FOR FRONTEND
  checkAuth: async (req, res) => {
    const accessToken = req.body.accessToken;
    //console.log(accessToken)
    const success = true;
    const fail = false;
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).json({ fail });
        }
        return res.status(200).json({ success });
      });
    } else {
      return res.status(401).json({ fail });
    }
  },

  //UPDATE PASSWORD
  updatePassword: async (req, res) => {
    try {
      console.log("changing pass")
      const user = await User.findById(req.params.id);
      const updatedPassword = req.body;
      if (!user) {
        return res.status(404).json("Can't find user!");
      }
      //Update
      if (updatedPassword.oldPassword) {
        const validPassword = await bcrypt.compare(
          updatedPassword.oldPassword,
          user.password
        );
        if (!validPassword) {
          return res.status(404).json("Incorrect password");
        }
        console.log("old pass is valid")
        if (updatedPassword.newPassword) {
          console.log(updatedPassword.newPassword)

          const salt = await bcrypt.genSalt(10);
          const hashed = await bcrypt.hash(updatedPassword.newPassword, salt);
          user.password = hashed;
          await user.save();
          return res.status(200).json(user);
        }

      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};



module.exports = authController;
