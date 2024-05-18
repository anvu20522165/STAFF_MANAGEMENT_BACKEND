const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 6,
      max: 20,
      unique: true,
    },
    fullname: {
      type: String,
    },
    avt: {
      type: String,
      default: "https://imgkub.com/images/2022/04/07/user-1.png",
    },
    verificationToken: String,
    email: {
      type: String,
      require: true,
      max: 50,
      unique: true,
    },
    cccd: {
      type: String,
      require: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
    birth: {
      type: Date,
    },
    phone: {
      type: String,
      max: 12,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      default: "MALE",
    },
    position: {
      type: String,
      default: "NHAN_VIEN"
    },
    department: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
