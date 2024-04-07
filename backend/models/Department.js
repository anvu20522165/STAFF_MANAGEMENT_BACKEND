const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    TenPB: {
      type: String,
      required: true,
      trim: true,
    },
    TruongPhong: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
