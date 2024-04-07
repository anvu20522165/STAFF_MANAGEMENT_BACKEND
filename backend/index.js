//backend for staff management
const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const departmentRoute = require("./routes/department");
const announcementRoute = require("./routes/announcement");

dotenv.config();

mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("CONNECTED TO MONGO DB");
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//ROUTES
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.use("/v1/department", departmentRoute);
app.use("/v1/announcement", announcementRoute);

app.listen(5555, () => {
  console.log("Server is running port 5555!");
});
