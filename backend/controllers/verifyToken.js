const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  //ACCESS TOKEN FROM HEADER, REFRESH TOKEN FROM COOKIE
  const token = req.headers['authorization'];
  const refreshToken = req.cookies.refreshToken;
  if (token) {
    //console.log(token)

    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You're not authenticated");
  }
};

const verifyTokenAndUserAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json("You're not allowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json("You're not allowed to do that!");
    }
  });
};

const verifyDepartmentHead = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log(req.user.position)
    if (req.user.position === "TRUONG_PHONG") {
      next();
    } else {
      // return res.status(403).json("Bạn không có quyền truy cập :vv");
      next()
    }
  });
};


module.exports = {
  verifyToken,
  verifyTokenAndUserAuthorization,
  verifyTokenAndAdmin,
  verifyDepartmentHead
};
