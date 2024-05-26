const mongoose = require("mongoose");

const hardwareSchema = new mongoose.Schema(
  {
    deviceName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required:true,
    },
    NumberOfDevice: {
      type: Number,
      default: 1,
    },
    mainowner: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("hardware", hardwareSchema);
