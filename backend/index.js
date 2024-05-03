const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const announcementRoute = require("./routes/announcement");
const documentRoute = require("./routes/document");
const requestRoute = require("./routes/request");
const multiTask = require("./routes/multiTask");
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB:", err));

// Configure Passport and JWT
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ACCESS_KEY // Use the correct secret key
}, (jwtPayload, done) => {
  return done(null, jwtPayload);
}));

app.use(passport.initialize());
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// ROUTES
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.use("/v1/announcement", announcementRoute);
app.use("/v1/document",documentRoute);
app.use("/v1/request", requestRoute);
app.use("/v1/multiTask", multiTask);
app.listen(5555, () => {
  console.log("Server is running on port 5555!");
});
